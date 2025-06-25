"use client";

import Link from "next/link";

export default function Content() {
  return (
    <div style={{height: "200px", paddingTop: "20px"}}>
      <h1 style={{fontSize: "20px", fontWeight: "600"}}> Content</h1>
      <h1 style={{padding: "10px 30px"}}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </h1>
      <Link className="links" href={"/slots/mainContent"}>
        Main Content
      </Link>
    </div>
  );
}
