// "use client";

// import {useState} from "react";

// export default function Home() {
//   const [name, setName] = useState("Hey");
//   let simpleVar = "buddy";
//   const Fun = () => {
//     setName("We are here to help you");

//     simpleVar = "Bro";
//     return 1;
//   };
//   const InnerComponent1 = () => {
//     // setName("We are here to help you");
//     return "Using component";
//   };
//   const funWithParams = (data: any) => {
//     alert(data + "'s here");
//     // setName("abc");
//   };
//   return (
//     <main className=" min-h-screen text-center p-24">
//       <h1 style={{fontSize: "28px", fontWeight: 800}}>
//         {name} {simpleVar}
//       </h1>
//       <br />
//       {/* <Test name="Ali" /> */}
//       <div className="flex justify-center" style={{gap: "10px"}}>
//         <button
//           onClick={() => {
//             alert("OO");
//           }}
//         >
//           click
//         </button>
//         <button onClick={Fun}>Call function</button>
//         <button onClick={() => funWithParams("nabeel")}>
//           Call function with params
//         </button>
//         <button
//           onClick={(e) => {
//             throw new Error("Error in application123");
//           }}
//         >
//           Throw Error
//         </button>
//       </div>
//       {InnerComponent1()}
//       <br />
//       <InnerComponent1 />
//     </main>
//   );
// }

// const Test = (props: any) => {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h3>Oye {props.name} too</h3>
//     </main>
//   );
// };

// "use client";

// import {useChat} from "ai/react";

// export default function Page() {
//   const {messages, input, data, error, id, setInput, append} = useChat({
//     api: "api",
//   });

//   return (
//     <div>
//       <input
//         value={input}
//         onChange={(event) => {
//           setInput(event.target.value);
//         }}
//         onKeyDown={async (event) => {
//           if (event.key === "Enter") {
//             append({content: input, role: "user"});
//           }
//         }}
//       />

//       {messages.map((message, index) => (
//         <>
//           <div
//             key={index}
//             style={{fontWeight: message.role == "user" ? "800" : "500"}}
//           >
//             {message.content}
//           </div>
//           {message.role == "assistant" ? (
//             <>
//               <hr style={{border: "1px solid black"}} />
//               <br />
//             </>
//           ) : (
//             ""
//           )}
//           {/* {data} {error?.message} */}
//           {/* id: {id} */}
//         </>
//       ))}
//     </div>
//   );
// }

"use client";

import {CoreMessage} from "ai";
import {useChat} from "ai/react";
import {useState} from "react";
import Image from "next/image";

export default function Chat() {
  const {messages, input, handleInputChange, handleSubmit} = useChat({
    api: "api",
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
                      <Image
                        key={ti.toolCallId}
                        src={`data:image/png;base64,${ti.result.image}`}
                        alt={ti.result.prompt}
                        height={400}
                        width={400}
                      />
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

      <form onSubmit={handleSubmit}>
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
