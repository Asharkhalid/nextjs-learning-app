import {openai} from "@ai-sdk/openai";
import {experimental_generateImage, Message, streamText, tool} from "ai";
import {z} from "zod";

export async function POST(request: Request) {
  console.log("request: ", request);
  const {messages, prompt}: {messages: Message[]; prompt: any} =
    await request.json();
  console.log("prompt: ", prompt);
  // filter through messages and remove base64 image data from assisstant messages to avoid sending to the model
  const formattedMessages = messages.map((m) => {
    console.log("single message: ", m);
    if (m.role === "assistant" && m.toolInvocations) {
      m.toolInvocations.forEach((ti) => {
        console.log("single toolInvocations: ", ti);
        if (ti.toolName === "generateImage" && ti.state === "result") {
          ti.result.image = `redacted-for-length`;
        }
      });
    }
    return m;
  });

  const result = streamText({
    model: openai("gpt-4o"),
    messages: formattedMessages,
    tools: {
      generateImage: tool({
        description: "Generate an image",
        parameters: z.object({
          prompt: z.string().describe("The prompt to generate the image from"),
        }),
        execute: async ({prompt}) => {
          console.log("prompt in execute: ", prompt);

          const {image} = await experimental_generateImage({
            model: openai.image("dall-e-3"),
            prompt,
          });
          // in production, save this image to blob storage and return a URL
          return {image: image.base64, prompt};
        },
      }),
    },
  });
  return result.toDataStreamResponse();
}
