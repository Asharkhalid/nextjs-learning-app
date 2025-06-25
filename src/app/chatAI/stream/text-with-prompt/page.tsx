"use client";

import {useChat} from "ai/react";

export default function Page() {
  const {messages, input, setInput, append} = useChat({
    api: "/api/AI/stream/text-by-prompt",
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
