"use client";

export default function Footer() {
  const liStyle = {
    height: "50px",
    padding: "10px",
    fontSize: "1.2rem",
    cursor: "pointer",
  };
  const navStyle = {
    height: "50px",
    backgroundColor: "gray",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    paddingLeft: "20px",
  };
  return (
    <>
      <ul style={navStyle}>
        <div style={liStyle}>Footer content</div>
        <div style={liStyle}>Cart</div>
        <div style={liStyle}>Profile</div>

        {/* <Link style={liStyle} href={''}>Review</Link> */}
      </ul>
    </>
  );
}
