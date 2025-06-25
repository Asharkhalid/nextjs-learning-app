"use client";

import {useCompletion} from "ai/react";

export default function Page() {
  const {completion, isLoading, complete} = useCompletion({
    api: "/api/AI/stream/text-by-button",
  });

  return (
    <div>
      <button
        style={{
          height: "40px",
          backgroundColor: "skyblue",
        }}
        onClick={async () => {
          await complete("Why is the sky blue?");
        }}
      >
        Generate
      </button>
      <br />
      {completion}
    </div>
  );
}
