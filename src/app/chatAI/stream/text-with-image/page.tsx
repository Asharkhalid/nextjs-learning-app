"use client";

import {useChat} from "ai/react";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: "/api/AI/stream/text-by-image",
  });
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          handleSubmit(e, {
            data: {
              imageUrl:
                "https://qzhcwstmdiioleqjteiz.supabase.co/storage/v1/object/public/images//blob-1739805823994.jpeg",
            },
          });
        }}
      >
        <input
          value={input}
          placeholder="What does the image show..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
