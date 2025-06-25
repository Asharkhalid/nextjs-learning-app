'use client';

import { useState } from 'react';

export default function Agent() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const newUserMessage = { role: 'user', content: input };
    setMessages([...messages, newUserMessage]);
    setInput('');

    try {
      const res = await fetch('/api/openAI/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      const newAssistantMessage = { role: 'assistant', content: data };
      setMessages([...messages, newUserMessage, newAssistantMessage]);
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
      <h1>Agent Chatbot</h1>
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
        <h2>Chat:</h2>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
          {isLoading ? 'Loading...' : ''}
      </div>
    </div>
  );
}
