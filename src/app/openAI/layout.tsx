"use client";

import type {Metadata} from "next";
import {Inter} from "next/font/google";
// import ".././globals.css";
import Link from "next/link";
import {usePathname} from "next/navigation";

const inter = Inter({subsets: ["latin"]});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const liStyle = {
    height: "50px",
    padding: "10px",
    fontSize: "1rem",
    cursor: "pointer",
  };
  const navStyle = {
    height: "50px",
    backgroundColor: "skyblue",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    paddingLeft: "20px",
  };

  return (
      <div className={inter.className}>
        <ul style={navStyle}>
          <Link
            style={liStyle}
            className={
              pathName.includes("/openAI/agent")
                ? "font-bold bg-[green] text-white"
                : " text-green"
            }
            href={"/openAI/agent"}
          >
            Agent
          </Link>
          <Link
            style={liStyle}
            className={
              pathName == "/openAI/response-api"
                ? "font-bold bg-[green] text-white"
                : " text-green"
            }
            href={"/openAI/response-api"}
          >
            Response API
          </Link>
          <Link
            style={liStyle}
            className={
              pathName == "/openAI/browser-use"
                ? "font-bold bg-[green] text-white"
                : " text-green"
            }
            href={"/openAI/browser-use"}
          >
            Browser Use
          </Link>

          {/* <Link style={liStyle} href={''}>Review</Link> */}
        </ul>
        <div style={{padding: "20px"}}>.{children}</div>
      </div>
  );
}
