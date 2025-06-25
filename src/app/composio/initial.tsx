// import { OpenAI } from "openai";
// import { OpenAIToolSet } from "composio-core";
// import openaiClient from "../lib/openai";


// export async function ComposioMain() {
//     try {
//         console.log("🚀 Starting Composio quickstart demo...");

//         // Initialize OpenAI and Composio clients
//         console.log("📦 Initializing OpenAI and Composio clients...");
//         const client = new OpenAI();
//         const toolset = new OpenAIToolSet({
//             apiKey: process.env.COMPOSIO_API_KEY,
//         });

//         console.log("🔍 Finding relevant GitHub actions for the use case...");
//         const actionsEnums = await toolset.client.actions.findActionEnumsByUseCase({
//             apps: ["github"],
//             useCase: "star a repo, print octocat"
//         });
//         console.log("✅ Found relevant actions:", actionsEnums);

//         // Get the tools for GitHub actions
//         console.log("🛠️  Getting tools for the actions...");
//         const tools = await toolset.getTools({ actions:  ["GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER", ""] });

//         const task = "star composiohq/composio and print me an octocat.";
//         console.log("\n📝 Task:", task);

//         const messages:any[] = [
//             { role: "system", content: "You are a helpful assistant." },
//             { role: "user", content: task },
//         ];

//         console.log("\n🤖 Starting conversation loop with AI...");
//         while (true) {
//             console.log("\n⏳ Waiting for AI response...");
//             const response = await openaiClient.chat.completions.create({
//                 model: "gpt-4o",
//                 tools: tools,
//                 messages: messages,
//             });

//             if (!response.choices[0].message.tool_calls) {
//                 console.log("💬 AI Response:", response.choices[0].message.content);
//                 break;
//             }

//             console.log("🔧 Executing tool calls...");
//             const result = await toolset.handleToolCall(response);
//             console.log("✅ Tool execution result:", result);

//             messages.push({
//                 role: "assistant",
//                 content: "",
//                 tool_calls: response.choices[0].message.tool_calls,
//             });

//             messages.push({
//                 role: "tool",
//                 content: String(result),
//                 tool_call_id: response.choices[0].message.tool_calls[0].id,
//             });
//         }

//         console.log("\n✨ Demo completed successfully!");
//     } catch (error:any) {
//         console.error("❌ Error occurred:", error);
//         if (error.response) {
//             console.error("📄 Response data:", error.response.data);
//         }
//     }
// }

// ComposioMain();







// import { ActionExecutionResDto, OpenAIToolSet, RawExecuteRequestParam } from "composio-core"
// import { OpenAI } from "openai";
// import { z } from "zod"

// const openai_client = new OpenAI();
// const toolset = new OpenAIToolSet();

// export async function ComposioMain() {
//     await toolset.createAction({
//     actionName: "calculateSum",
//     description: "Calculate the sum of two numbers",
//     inputParams: z.object({
//         a: z.number(),
//         b: z.number()
//     }),
//     callback: async (inputParams: {}, authCredentials: Record<string, string> | undefined, executeRequest: (data: RawExecuteRequestParam) => Promise<ActionExecutionResDto>) => {
//         const { a, b } = inputParams as { a: number, b: number };
//         const sum = a + b;
//         return {
//             successful: true,
//             data: {
//             sum: sum
//             }
//         };
//     }
//     });

//     const tools = await toolset.getTools({
//     actions: ["calculateSum"]
//     });
//     const instruction = "What is 3932 + 2193?";

//     const response = await openai_client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: instruction }],
//     tools: tools,
//     tool_choice: "auto",
//     });

//     const result = await toolset.handleToolCall(response);
//     console.log("response: ", response);
//     console.log("result: ", result);
// }





import { openai } from "@ai-sdk/openai";
import {  ComposioToolSet, VercelAIToolSet } from "composio-core";
import { generateText } from "ai";

export async function ComposioMain() {
    const toolset = new VercelAIToolSet();
    const tools = await toolset.getTools({ actions: ["GOOGLECALENDAR_CREATE_EVENT"] });
    console.log("tools: ", tools);
    const output = await generateText({
        model: openai("gpt-4o-mini"),
        tools,
        prompt: 'create a new calenar event having duration of 45 minutes staring from 27th march 2025 2:00 PM',
        
    });
    console.log("output.text: ", output.text);
    console.log("output.response: ", output.response);
    console.log("output.toolResults: ", output.toolResults);

        // const tool_response = await toolset.connectedAccounts.;
}




// import { Composio, OpenAIToolSet } from 'composio-core';
// import openaiClient from '../lib/openai';
// // const toolset = new OpenAIToolSet({ apiKey: 'aks5ij82unqwdsjkoyq4f' });

// export async function ComposioMain() {
//     const composio_toolset = new OpenAIToolSet({
//         apiKey: "aks5ij82unqwdsjkoyq4f"
//     });

//     const tools = await composio_toolset.getTools({
//         actions: ["GOOGLECALENDAR_FIND_EVENT"]
//     });
//     // const integration = await composio_toolset.integrations.get({integrationId: 'ffaac0fc-6697-4c72-b740-040d6d016155'});
//     // const expectedInputFields = await composio_toolset.integrations.getRequiredParams(integration.id);
//     // Collect auth params from your users
//     // console.log(expectedInputFields);

//     // const connectedAccount = await composio_toolset.connectedAccounts.initiate({
//     //     integrationId: integration.id,
//     //     entityId: 'default',
//     // });
// //     const composio = new Composio({apiKey: "aks5ij82unqwdsjkoyq4f"});

// // const connection = await composio.connectedAccounts.get({
// //     connectedAccountId: "96670aff-d143-436a-9b8a-2fd8a08fbd3a"
// // })
// // console.log("connection: ", connection);


//     const instruction = "find all tasks";

//     // Creating a chat completion request to the OpenAI model
//     const response = await openaiClient.chat.completions.create({
//         model: "gpt-4-turbo",
//         messages: [{ role: "user", content: instruction }],
//         tools: tools,
//         tool_choice: "auto",
//     });

//     const tool_response = await composio_toolset.handleToolCall(response);

//     console.log("response: ", response.choices[0].message.content);
//     console.log("tool_response: ", tool_response);


// }
