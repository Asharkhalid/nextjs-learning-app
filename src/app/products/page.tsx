"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Blob1() {
  const router = useRouter();
  const gotoDetailPage = () => {
    router.push("products/4");
  };
  return (
    <>
      <Link href={"products/1"}>Product 1</Link>
      <br />
      <Link href={"products/2"}>Product 2</Link>
      <br />
      <Link href={"products/3"} replace>
        Going on to that link & pressing back arrow will go back to 2bl previous
        url (replace)
      </Link>
      <br />
      <button onClick={gotoDetailPage}>Product 4</button>
      <button
        onClick={(e) => {
          throw new Error("Error in application");
        }}
      >
        error
      </button>
    </>
  );
}
