import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/app/lib/polar";
import { trackUsage } from "@/app/lib/usage-tracking";
import { callSharedAIService } from "@/app/lib/aiService";
import Replicate from 'replicate';
import OpenAI from "openai"; // For error typing

const replicateApiToken = process.env.REPLICATE_API_TOKEN;
const replicate = replicateApiToken ? new Replicate({ auth: replicateApiToken }) : null;

async function checkCustomerCredits(customerId: string, requiredCredits: { script: number; image: number }) {
  try {
    const customerState = await polar.customers.getState({ id: customerId });
    const scriptCredits = customerState.activeMeters.find(m => m.meterId === 'e45fd163-8065-4f05-8941-37bdd55b5915')?.balance || 0;
    const imageCredits = customerState.activeMeters.find(m => m.meterId === '694bc31b-b226-4b39-b7f1-bd508f6aed01')?.balance || 0;

    return {
      hasCredits: {
        script: scriptCredits >= requiredCredits.script,
        image: imageCredits >= requiredCredits.image,
      },
      balances: { script: scriptCredits, image: imageCredits },
    };
  } catch (error) {
    console.error('Error checking customer credits:', error);
    throw new Error('Unable to verify credit balance');
  }
}

async function generateImagesReplicate(): Promise<string | null> {
    if (!replicate) {
        console.error("Replicate client not initialized for image generation.");
        throw new Error("Image generation service is not configured.");
    }
    const prompt = `High-quality Pixar animation style portrait of Alex . Detailed face, expressive features, cinematic lighting, centered character, plain background suitable for variations. Consistent character design.`;
    try {
        const output = await replicate.run("black-forest-labs/flux-1.1-pro-ultra", {
            input: {
                prompt: prompt,
                negative_prompt: "blurry, low quality, text, watermark, multiple characters, ugly, deformed, disfigured, extra limbs, missing limbs, poorly drawn eyes, distorted face, unrealistic anatomy, complex background",
                aspect_ratio: "16:9",
            }
        });
        return (Array.isArray(output) ? output[0] : output) as string | null;
    } catch (error) {
        console.error(`Error generating image via Replicate:`, error);
        throw new Error("Failed to generate image.");
    }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, customerId } = await request.json();

    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    if (!customerId) return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    if (!replicate) return NextResponse.json({ error: "Image generation service not available" }, { status: 503 });

    const estimatedCredits = { script: 10, image: 1 }; // image credits seems to be per image
    const creditCheck = await checkCustomerCredits(customerId, estimatedCredits);

    if (!creditCheck.hasCredits.script || !creditCheck.hasCredits.image) {
      return NextResponse.json({ error: 'Insufficient credits for video generation', details: creditCheck }, { status: 402 });
    }

    console.log('Generating script...');
    const script = await callSharedAIService(prompt, "gpt-4"); // Specify model if different from default
    await trackUsage(customerId, 'script_usage', {
      total_tokens: script.usage.total_tokens,
      model: 'gpt-4', // Ensure this matches the model used
      prompt_length: prompt.length
    });

    console.log('Generating images...');
    const imageUrl = await generateImagesReplicate();
     if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to generate image for video' }, { status: 500 });
    }
    await trackUsage(customerId, 'image_usage', {
      images: 1,
      model: 'black-forest-labs/flux-1.1-pro-ultra',
      aspectRatio: '16:9'
    });

    // Placeholder for actual video/audio generation and combination
    console.log('Video generation steps (audio, video, combine) would go here.');

    return NextResponse.json({
      success: true,
      script: script.text,
      imageUrl: imageUrl,
      creditsUsed: {
        script: script.usage.total_tokens,
        image: 1, // Assuming 1 credit per image generated
      }
    });

  } catch (error: any) {
    console.error("Generate Video API Error:", error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}`, type: error.type },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during video generation." },
      { status: 500 }
    );
  }
}