'use client';

import { openai } from '@ai-sdk/openai';
import { useState } from 'react';

interface Source {
  title: string;
  url: string;
}

export default function ResposneAPI() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]); // New state for sources

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const newUserMessage = { role: 'user', content: input };
    setMessages([...messages, newUserMessage]);
    setInput('');
    setSources([]); // Clear previous sources

    try {
      const res = await fetch('/api/openAI/response-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      const newAssistantMessage = { role: 'assistant', content: data.text };
      setMessages([...messages, newUserMessage, newAssistantMessage]);

      // Extract and set sources
      if (data.sources && Array.isArray(data.sources)) {
        const formattedSources: Source[] = data.sources.map((source: any) => ({
          title: source.title || 'No Title',
          url: source.url || '',
        }));
        setSources(formattedSources);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([
        ...messages,
        newUserMessage,
        { role: 'assistant', content: 'An error occurred while fetching the response.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Response API with OpenI Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message..."
          style={{ padding: '0.5rem', borderRadius: '0.5rem', width: '30%' }}
        />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <strong style={{fontSize:"1.2rem"}}>{message.role}:</strong> {message.content}
          </div>
        ))}
        {isLoading ? 'Loading...' : ''}
      </div>
      {/* Display sources */}
      {sources.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong style={{fontSize:"1.2rem"}}>Sources:</strong>
          <ul>
            {sources.map((source, index) => (
              <li key={index}>
                <a style={{"color":"blue"}} href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
