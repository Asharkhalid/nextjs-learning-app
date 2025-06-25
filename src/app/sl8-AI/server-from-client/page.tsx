"use client";

import {type Message, useChat} from "ai/react";

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: "/api/sl8-AI/server-from-client",
    // Handle client-side tool execution
    async onToolCall({toolCall}) {
      console.log("Tool call toolName", toolCall.toolName);
      console.log("Tool call args", toolCall.args);
      if (toolCall.toolName === "getClientPreference") {
        // Simulate getting client preference
        const preferences = {
          theme: "dark-mode",
          language: "en",
        };
        toolCall.args = preferences.theme;
        // toolCall.parameters.preferenceName
        return preferences.theme;
      }
    },
  });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="space-y-4">
        {messages.map((m: Message) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Try asking: 'How should the UI look?' or 'What's my theme preference?'"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
