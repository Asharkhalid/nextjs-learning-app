"use client";

import {useChat} from "@ai-sdk/react";

export default function Page() {
  const {messages, input, setInput, append} = useChat({
    api: "/api/AI/tools/parallel-tool-calls",
    maxSteps: 2,
  });

  return (
    <div>
      <input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            append({content: input, role: "user"});
          }
        }}
      />

      {messages.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}
    </div>
  );
}
