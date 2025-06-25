// import {CoreMessage, streamText} from "ai";
// import {openai} from "@ai-sdk/openai";

// export async function POST(req: Request) {
//   const {messages}: {messages: CoreMessage[]} = await req.json();
//   debugger;
//   const result = streamText({
//     model: openai("gpt-4"),
//     system: "You are a helpful assistant.",
//     messages,
//   });

//   return result.toDataStreamResponse();
// }

import {
  CoreMessage,
  experimental_generateImage,
  generateText,
  streamText,
  tool,
} from "ai";
import {openai} from "@ai-sdk/openai";
import {z} from "zod";

export async function POST(req: Request) {
  const {messages}: {messages: CoreMessage[]} = await req.json();

  const response = await streamText({
    model: openai("gpt-4"),
    system: "You are a helpful assistant.",
    messages,
    tools: {
      generateImage: tool({
        description: "Generate an image",
        parameters: z.object({
          prompt: z.string().describe("The prompt to generate the image from"),
        }),
        execute: async ({prompt}) => {
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

  return response.toDataStreamResponse();

  //   return Response.json({messages: response.messages});
}
