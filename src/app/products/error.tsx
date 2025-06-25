"use client";

export default function ErrorBoundary({error}: {error: Error}) {
  return <h1>product error text {error.message}</h1>;
}
