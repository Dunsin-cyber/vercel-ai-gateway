'use client';

import { useState, useRef, useEffect } from 'react';
import ProviderSelector from '@/components/ProviderSelector';
import { Provider, PROVIDER_CONFIGS, Message } from '@/types/chat';

export default function ChatPage() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('openai');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProviderAnimation, setShowProviderAnimation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProviderChange = (provider: Provider) => {
    if (provider !== selectedProvider) {
      setSelectedProvider(provider);
      
      // Add system message to indicate provider switch
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `Switched to ${PROVIDER_CONFIGS[provider].displayName} (${PROVIDER_CONFIGS[provider].model})`,
        provider: provider,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, systemMessage]);

      // Trigger animation
      setShowProviderAnimation(true);
      setTimeout(() => setShowProviderAnimation(false), 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          provider: selectedProvider,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        provider: selectedProvider,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content = accumulatedContent;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Error: Failed to get response from AI provider',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentConfig = PROVIDER_CONFIGS[selectedProvider];

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <h1 className="chat-title">AI Chat</h1>
          <div className="provider-info">
            <ProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={handleProviderChange}
              showAnimation={showProviderAnimation}
            />
            <div className="current-model">
              <span className="model-label">Model:</span>
              <span 
                className="model-name"
                style={{ color: currentConfig.color }}
              >
                {currentConfig.model}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="chat-main">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h2>Welcome to AI Chat</h2>
              <p>Select a provider and start chatting!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message message-${message.role}`}
              >
                {message.role === 'system' ? (
                  <div className="system-message">
                    <span className="system-icon">ℹ️</span>
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <>
                    <div className="message-header">
                      <span className="message-role">
                        {message.role === 'user' ? '👤 You' : '🤖 AI'}
                      </span>
                      {message.provider && (
                        <span 
                          className="message-provider"
                          style={{ color: PROVIDER_CONFIGS[message.provider].color }}
                        >
                          {PROVIDER_CONFIGS[message.provider].displayName}
                        </span>
                      )}
                    </div>
                    <div className="message-content">{message.content}</div>
                  </>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !input.trim()}
            style={{ backgroundColor: currentConfig.color }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </footer>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 100%;
          margin: 0 auto;
          background-color: #f9fafb;
        }

        .chat-header {
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 24px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .chat-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 16px 0;
        }

        .provider-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .current-model {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .model-label {
          font-weight: 600;
          color: #6b7280;
        }

        .model-name {
          font-weight: 700;
          font-family: 'Courier New', monospace;
        }

        .chat-main {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .messages-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        }

        .empty-state h2 {
          font-size: 24px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 16px;
          margin: 0;
        }

        .message {
          padding: 16px;
          border-radius: 12px;
          max-width: 80%;
        }

        .message-user {
          align-self: flex-end;
          background-color: #e0e7ff;
          margin-left: auto;
        }

        .message-assistant {
          align-self: flex-start;
          background-color: white;
          border: 1px solid #e5e7eb;
        }

        .message-system {
          align-self: center;
          background-color: #fef3c7;
          border: 1px solid #fcd34d;
          max-width: 100%;
        }

        .system-message {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #92400e;
          justify-content: center;
        }

        .system-icon {
          font-size: 16px;
        }

        .message-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 12px;
        }

        .message-role {
          font-weight: 600;
          font-size: 14px;
          color: #374151;
        }

        .message-provider {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .message-content {
          color: #1f2937;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .chat-footer {
          background-color: white;
          border-top: 1px solid #e5e7eb;
          padding: 16px 24px;
        }

        .input-form {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 12px;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: #9ca3af;
        }

        .chat-input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .send-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .send-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 12px 16px;
          }

          .chat-title {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .chat-main {
            padding: 16px;
          }

          .message {
            max-width: 90%;
          }

          .chat-footer {
            padding: 12px 16px;
          }

          .input-form {
            flex-direction: column;
            gap: 8px;
          }

          .send-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
