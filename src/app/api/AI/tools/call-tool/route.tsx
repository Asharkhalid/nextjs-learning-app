import {experimental_generateImage, generateText, streamText} from "ai";
import {openai} from "@ai-sdk/openai";
import {z} from "zod";

interface ToolInvocation {
  toolName: string;
  args: any;
  state: "call" | "result";
  result?: any;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

export async function POST(req: Request) {
  const {messages}: {messages: Message[]} = await req.json();

  // Define the tools
  const tools = {
    getWeather: {
      description: "Get the weather for a location",
      parameters: z.object({
        city: z.string().describe("The city to get the weather for"),
        unit: z
          .enum(["C", "F"])
          .describe("The unit to display the temperature in"),
      }),
      execute: async ({city, unit}: {city: string; unit: "C" | "F"}) => {
        const weather = await generateText({
          model: openai("gpt-4o"),
          system: "You are system that can get the weather for a location.",
          prompt: `Get the weather for ${city} in ${unit} units.`,
        });
        console.log("weather: ", weather);
        return weather;
      },
    },
    generateImage: {
      description: "Generate an image",
      parameters: z.object({
        prompt: z.string().describe("The prompt to generate the image from"),
      }),
      execute: async ({prompt}: {prompt: string}) => {
        console.log("prompt in execute: ", prompt);

        const {image} = await experimental_generateImage({
          model: openai.image("dall-e-3"),
          prompt,
        });
        // in production, save this image to blob storage and return a URL
        return {image: image.base64, prompt};
      },
    },
  };

  // Process messages: for any tool invocation in state "call" without a result,
  // execute the tool and update the invocation.
  for (const message of messages) {
    if (message.toolInvocations) {
      for (const invocation of message.toolInvocations) {
        if (invocation.state === "call") {
          const tool = tools[invocation.toolName as keyof typeof tools];
          if (tool) {
            const result = await tool.execute(invocation.args);
            // Update the invocation to mark it as complete and attach the result.
            invocation.state = "result";
            invocation.result = result;
          }
        }
      }
    }
  }

  // Pass the updated messages (with complete tool invocations) to streamText.
  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    messages,
    tools,
  });

  return result.toDataStreamResponse();
}
