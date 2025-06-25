"use client";

import {useChat} from "ai/react";
import Image from "next/image";

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: "/api/AI/generate/image-by-prompt",
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div key={m.id}>
              <div className="font-bold">{m.role}</div>
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
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) =>
          handleSubmit(e, {
            body: {
              prompt: input,
            },
          })
        }
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
