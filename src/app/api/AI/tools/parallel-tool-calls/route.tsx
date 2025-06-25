import {ToolInvocation, generateText, streamText} from "ai";
import {openai} from "@ai-sdk/openai";
import {z} from "zod";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

function getDetail({city, unit}: {city: string; unit: "C" | "F"}) {
  return {value: 25, description: "Sunny"};
}

export async function POST(req: Request) {
  const {messages}: {messages: Message[]} = await req.json();

  messages.forEach((message) => {
    console.log("message: ", message);
    message.toolInvocations?.forEach((toolInvocation) => {
      console.log("toolInvocation: ", toolInvocation);
    });
  });

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a Prompt Detail Analyst. Your task is to provide a brief detail about the prompt provided by the user. Summarize the prompt's intent and key points in one short paragraph using clear, plain language.`,
    messages,
    tools: {
      getDetail: {
        description: "Get the detail of entered prompt",
        parameters: z.object({
          prompt: z.string().describe("the prompt to get the detail of"),
        }),
        execute: async ({prompt}) => {
          console.log("in tool execute: ..........");
          const details = await generateText({
            model: openai("gpt-4o"),
            system: `You are a Prompt Detail Analyzer. Given an input prompt, produce a concise and clear one-paragraph description that captures its main intent and key components. Use plain language without extra formatting.`,
            prompt: prompt,
          });
          console.log("details: ", details);
          return details;
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
