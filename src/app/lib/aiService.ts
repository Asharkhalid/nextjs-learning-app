import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const DEFAULT_AI_MODEL = "gpt-4";

if (!apiKey && process.env.NODE_ENV !== 'test') { // Avoid error during build/lint if key is not needed for all paths
  console.warn("WARN: OPENAI_API_KEY is not set. AI service calls will fail if attempted.");
}

const openai = new OpenAI({ apiKey });

export interface AIServiceResponse {
  text: string;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export async function callSharedAIService(prompt: string, model: string = DEFAULT_AI_MODEL): Promise<AIServiceResponse> {
  if (!apiKey) {
      throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.");
  }
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
    });

    const textResponse = completion.choices[0]?.message?.content;
    const usageData = completion.usage;

    if (!textResponse) throw new Error("No text response received from AI service.");
    if (!usageData) throw new Error("No usage data received from AI service.");

    return {
      text: textResponse,
      usage: { ...usageData },
    };
  } catch (error) {
    console.error("Error in callSharedAIService:", error);
    throw error; // Re-throw to be handled by the caller
  }
}