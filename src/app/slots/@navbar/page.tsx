"use client";

import Link from "next/link";

export default function Navbar() {
  const liStyle = {
    height: "50px",
    padding: "10px",
    fontSize: "1.2rem",
    cursor: "pointer",
  };
  const navStyle = {
    height: "50px",
    backgroundColor: "cyan",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    paddingLeft: "20px",
  };
  return (
    <>
      <ul style={navStyle}>
        <div style={liStyle}>Products</div>
        <div style={liStyle}>Cart</div>
        <div style={liStyle}>Profile</div>

        {/* <Link style={liStyle} href={''}>Review</Link> */}
      </ul>
    </>
  );
}
