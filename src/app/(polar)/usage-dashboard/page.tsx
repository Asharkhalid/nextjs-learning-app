// components/UsageDashboard.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";


// Added for the new video generation response
interface VideoGenerationResponse {
  success: boolean;
  script?: string;
  imageUrl?: string;
  creditsUsed?: Record<string, number>;
}

// Define a type for the balance details to make the state more readable
interface MeterDetails {
  balance: number;
  consumedUnits: number;
  creditedUnits: number;
}

interface AIResponse {
  result: string;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  creditCost: number; // Optional field for credit cost
}

interface AIError {
  error: string;
  type?: string;
}

export default function UsageDashboard() {
  const [prompt, setPrompt] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("fe861b0d-a41b-4a69-b807-ffe97a8ce1b3"); // Default or allow input
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [videoResponse, setVideoResponse] = useState<VideoGenerationResponse | null>(null); // For video generation
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false); // Specific loading for video
  const [currentBalance, setCurrentBalance] = useState<Record<string, MeterDetails> | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setVideoResponse(null);

    try {
      const res = await fetch("/api/polar/ai-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, customerId }),
      });

      const data: AIResponse | AIError = await res.json();

      if (!res.ok) {
        const errorData = data as AIError;
        throw new Error(errorData.error || "Failed to fetch AI response");
      }

      setResponse(data as AIResponse);
    } catch (err: any) {
      // Ensure error is always a string
      const errorMessage = err?.message ? String(err.message) : "An unexpected error occurred.";
      setError(errorMessage);
      console.error("API call failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnimatedVideo = async () => {
    if (!prompt || !customerId) {
      setError("Prompt and Customer ID are required for video generation.");
      return;
    }
    setIsVideoLoading(true);
    setError(null);
    setResponse(null);
    setVideoResponse(null);

    try {
      const res = await fetch("/api/polar/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, customerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate animated video.");
      }
      setVideoResponse(data as VideoGenerationResponse);
    } catch (err: any) {
      // Ensure error is always a string
      const errorMessage = err?.message ? String(err.message) : "An unexpected error occurred during video generation.";
      setError(errorMessage);
      console.error("Video generation API call failed:", err);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleGetCurrentBalance = async () => {
    if (!customerId) {
      setError("Customer ID is required to fetch balance.");
      return;
    }
    setIsBalanceLoading(true);
    setError(null); // Clear previous errors related to balance fetching
    setCurrentBalance(null); // Clear previous balance
    try {
      // Call the new API route to fetch the balance
      const res = await fetch(`/api/polar/customer-balance?customerId=${customerId}`);
      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error || "Failed to fetch current balance from API.");
      }
      const balances = data.balances; // The API returns the balances object

      // Update state with the fetched balances
      setCurrentBalance(balances);
    } catch (err: any) {
      // Ensure error is always a string
      const errorMessage = err?.message ? String(err.message) : "Failed to fetch current balance.";
      setError(errorMessage);
      console.error('Error getting balance:', err);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">AI Service Interface</h1>

      <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
            Customer ID:
          </label>
          <input
            type="text"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateAnimatedVideo}
          disabled={loading || isVideoLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 mb-2"
        >
          {isVideoLoading ? "Generating Video..." : "Generate Animated Video (Usage)"}
        </button>
        <button
          type="button"
          onClick={handleGetCurrentBalance}
          disabled={loading || isBalanceLoading}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 mb-2"
        >
          {isBalanceLoading ? "Fetching Balance..." : "Get Current Balance"}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Prompt"}
        </button>
        
        {isBalanceLoading && <p className="text-sm text-gray-600 my-2">Loading balance...</p>}
        {/* Display error specific to balance fetching if it occurred and no balance is loaded */}
        {error && currentBalance === null && !isBalanceLoading && <p className="text-red-500 my-2">{error}</p>}

        {currentBalance && Object.keys(currentBalance).length > 0 && (
          <div className="my-4 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Current Balances:
            </h3>
            <ul className="space-y-3">
              {Object.entries(currentBalance).map(([meterId, details]) => (
                <li key={meterId} className="text-sm bg-white p-3 rounded-md shadow-sm border">
                  <p className="font-semibold text-gray-700">Meter ID: <span className="font-bold text-indigo-600">{meterId}</span></p>
                  <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-1">
                    <p><strong>Balance:</strong> {details.balance.toLocaleString()} units</p>
                    <p className="text-red-600"><strong>Consumed:</strong> {details.consumedUnits.toLocaleString()} units</p>
                    <p className="text-green-600"><strong>Credited:</strong> {details.creditedUnits.toLocaleString()} units</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentBalance && Object.keys(currentBalance).length === 0 && !isBalanceLoading && (
          <p className="text-sm text-gray-600 my-2">No balance data found for this customer.</p>
        )}


      </form>

      {error && <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}

      {response && (
        <div className="p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">AI Response:</h2>
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{response.result}</p>
          <h3 className="text-lg font-medium mb-1">Usage:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Credits Used: {response.creditCost}</li>
            <li>Total Tokens: {response.usage.total_tokens}</li>
            <li>Prompt Tokens: {response.usage.prompt_tokens}</li>
            <li>Completion Tokens: {response.usage.completion_tokens}</li>
          </ul>
        </div>
      )}

      {videoResponse && (
        <div className="mt-6 p-6 bg-green-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Video Generation Result:</h2>
          {videoResponse.success ? (
            <>
              <p className="text-green-700">Video generation process initiated successfully!</p>
              {videoResponse.script && <p className="mt-2"><strong>Script Snippet:</strong> {videoResponse.script.substring(0,100)}...</p>}
              {videoResponse.imageUrl && <p className="mt-2"><strong>Generated Image URL:</strong> <a href={videoResponse.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{videoResponse.imageUrl}</a></p>}
              {videoResponse.creditsUsed && <p className="mt-2"><strong>Credits Used:</strong> Script: {videoResponse.creditsUsed.script}, Image: {videoResponse.creditsUsed.image}</p>}
            </>
          ) : (
            <p className="text-red-700">Video generation failed.</p>
          )}
        </div>
      )}
    </div>
  );
}
