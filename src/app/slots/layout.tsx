"use client";

import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export default function SlotLayout({
  children,
  footer,
  navbar,
  content,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  navbar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
      <div>{navbar}</div>
      <div>{content}</div>
      <div>{footer}</div>
    </>
  );
}
