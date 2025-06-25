import {openai} from "@ai-sdk/openai";
import {streamText} from "ai";
import {z} from "zod";

export async function POST(req: Request) {
  const {messages} = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    // Add system message to instruct the model about using tools
    system: `You are a helpful assistant that personalizes responses based on user preferences.
    Always check user preferences using the getClientPreference tool before responding.
    After getting preferences, use processClientData to handle the data.`,
    tools: {
      getClientPreference: {
        // Improved description to better guide the model
        description:
          "Get user theme preference (light/dark mode). Use this before providing any UI-related responses.",
        parameters: z.object({
          preferenceName: z
            .string()
            .describe('The name of preference to fetch (e.g., "theme")'),
        }),
      },
      processClientData: {
        description:
          "Process the user preference data and adapt the response accordingly",
        parameters: z.object({
          clientData: z
            .string()
            .describe("The user preference data to process"),
        }),
        execute: async ({clientData}) => {
          return `User prefers: ${clientData}`;
        },
      },
    },
    maxSteps: 3, // Allow multiple steps for tool calls
  });

  return result.toDataStreamResponse();
}
