import { NextRequest, NextResponse } from "next/server";
import { canAffordUsage, trackAIUsage } from "@/app/lib/usage-tracking";
import OpenAI from 'openai';

// Retrieve the API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Estimate a reasonable maximum for output tokens for pre-check
export const ESTIMATED_MAX_OUTPUT_TOKENS = 500; // A common default or safe upper bound for many responses

if (!apiKey) {
  console.error("FATAL ERROR: The OPENAI_API_KEY environment variable is not set. Please ensure it's in your .env.local file and the server has been restarted.");
  // In a production scenario, you might throw an error here to prevent the OpenAI client from initializing incorrectly.
}
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey, // Use the retrieved and potentially validated apiKey
});

const AI_MODEL = "gpt-4"; // Define the model globally or pass as needed

export async function POST(request: NextRequest) {
  try {
    const { prompt, customerId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (!customerId) {
      // In a real app, you might get customerId from session/auth
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    // Call the actual AI service
    const response = await executeAIRequest(customerId, prompt);

    // Track usage
    const creditCost = await trackAIUsage(customerId, "openai", response.usage.total_tokens, AI_MODEL);
    
    return NextResponse.json({ 
      result: response.text,
      usage: response.usage,
      creditCost: creditCost 
    });
  } catch (error) {
    console.error("AI Service API Error:", error); // Log the detailed error for server-side debugging
    if (error instanceof OpenAI.APIError) {
      // Handle OpenAI specific API errors
      return NextResponse.json(
        { error: `AI service error: ${error.message}`, type: error.type },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}

interface AIServiceResponse {
  text: string;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export async function callAIService(prompt: string): Promise<AIServiceResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL, // e.g., "gpt-3.5-turbo", "gpt-4"
      messages: [{ role: "user", content: prompt }],
      // You can add other parameters here, like temperature, max_tokens, etc.
    });

    const textResponse = completion.choices[0]?.message?.content;
    const usageData = completion.usage;

    if (!textResponse) {
      throw new Error("No text response received from AI service.");
    }
    if (!usageData) {
      throw new Error("No usage data received from AI service.");
    }
console.log("AI Service Response:", {
      text: textResponse,
      usage: {
            total_tokens: usageData.total_tokens,
            prompt_tokens: usageData.prompt_tokens,
            completion_tokens: usageData.completion_tokens,
          },
    });
    return {
      text: textResponse,
      usage: {
        total_tokens: usageData.total_tokens,
        prompt_tokens: usageData.prompt_tokens,
        completion_tokens: usageData.completion_tokens,
      },
    };
  } catch (error) {
    // Log the error and re-throw it to be handled by the POST handler
    console.error("Error in callAIService:", error);
    throw error; // This allows the POST handler to catch OpenAI.APIError instances
  }
}


async function executeAIRequest(customerId: string, prompt: string) {
  // Estimate tokens (you might have a better estimation method)
  const estimatedInputTokens = Math.ceil(prompt.length / 4); // rough estimate for prompt
  const estimatedTotalTokens = estimatedInputTokens + ESTIMATED_MAX_OUTPUT_TOKENS; // Add estimated output tokens
  const provider = "openai"
  // Check if customer has enough credits
  const canAfford = await canAffordUsage(customerId, provider, estimatedTotalTokens);

  if (!canAfford) {
    throw new Error("Insufficient credits for this request");
  }
  
  // Execute AI request
  const response = await callAIService(prompt);
  
  return response;
}