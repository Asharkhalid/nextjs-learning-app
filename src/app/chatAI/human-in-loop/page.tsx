"use client";

import {useChat} from "@ai-sdk/react";

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat();

  return (
    <div>
      <div>
        {messages?.map((m) => (
          <div key={m.id}>
            <strong>{`${m.role}: `}</strong>
            {m.parts?.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={i}>{part.text}</div>;
              }
            })}
            <br />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
