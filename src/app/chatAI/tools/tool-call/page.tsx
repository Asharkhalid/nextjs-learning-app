"use client";

import {useChat} from "@ai-sdk/react";
import Image from "next/image";

export default function Page() {
  const {messages, input, setInput, append} = useChat({
    api: "/api/AI/tools/call-tool",
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

      {messages.map((m, index) => (
        <div key={index}>
          {m.toolInvocations ? (
            m.toolInvocations.map((ti) =>
              ti.toolName === "generateImage" ? (
                ti.state === "result" ? (
                  <>
                    {/* <div>{ti.args}</div> */}
                    <Image
                      key={ti.toolCallId}
                      src={`data:image/png;base64,${ti.result.image}`}
                      alt={ti.result.prompt}
                      height={400}
                      width={400}
                    />
                  </>
                ) : (
                  <div key={ti.toolCallId} className="animate-pulse">
                    Generating image...
                  </div>
                )
              ) : null
            )
          ) : (
            <p>{m.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
