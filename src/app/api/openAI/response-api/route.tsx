
import {CoreMessage, generateText} from "ai";
import {openai} from "@ai-sdk/openai";

export async function POST(req: Request) {
  const {messages}: {messages: CoreMessage[]} = await req.json();
  // Add a system message to instruct the model to always use the web_search_preview tool
  const systemMessage: CoreMessage = {
    role: "system",
    content:
      "You are a helpful assistant that always uses the `web_search_preview` tool to answer questions. Whenever a user asks a question, use the `web_search_preview` tool to search for relevant information before responding. If the user's message is not a question, you can respond directly without using the tool.",
  };

  // Combine the system message with the user's messages
  const allMessages = [systemMessage, ...messages];
  const result = await generateText({
    model: openai.responses("gpt-4o-mini"),
    messages: allMessages,
    // prompt: 'What happened in San Francisco last week?',
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: 'high',
        userLocation: {
          type: 'approximate',
          city: 'San Francisco',
          region: 'California',
        },
      }),
    },
  });

  console.log("result.text: ", result.text);
  console.log("result.sources: ", result.sources);

  return Response.json( result);
}
