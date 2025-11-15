'use client';

import { Provider, PROVIDER_CONFIGS } from '@/types/chat';

interface ProviderSelectorProps {
  selectedProvider: Provider;
  onProviderChange: (provider: Provider) => void;
  showAnimation?: boolean;
}

export default function ProviderSelector({
  selectedProvider,
  onProviderChange,
  showAnimation = false,
}: ProviderSelectorProps) {
  const providers: Provider[] = ['openai', 'anthropic', 'google'];

  return (
    <div className="provider-selector">
      <div className="provider-selector-label">AI Provider:</div>
      <div className={`provider-buttons ${showAnimation ? 'highlight-animation' : ''}`}>
        {providers.map((provider) => {
          const config = PROVIDER_CONFIGS[provider];
          const isSelected = selectedProvider === provider;

          return (
            <button
              key={provider}
              onClick={() => onProviderChange(provider)}
              className={`provider-button ${isSelected ? 'selected' : ''}`}
              style={{
                borderColor: isSelected ? config.color : undefined,
                backgroundColor: isSelected ? `${config.color}15` : undefined,
              }}
              aria-label={`Select ${config.displayName}`}
              aria-pressed={isSelected}
            >
              <span className="provider-icon">{getProviderIcon(provider)}</span>
              <span className="provider-name">{config.displayName}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .provider-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .provider-selector-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .provider-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .provider-buttons.highlight-animation {
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .provider-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
        }

        .provider-button:hover {
          border-color: #9ca3af;
          background-color: #f9fafb;
        }

        .provider-button.selected {
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .provider-icon {
          font-size: 18px;
          line-height: 1;
        }

        .provider-name {
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .provider-selector {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .provider-buttons {
            width: 100%;
          }

          .provider-button {
            flex: 1;
            justify-content: center;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}

function getProviderIcon(provider: Provider): string {
  const icons = {
    openai: '🤖',
    anthropic: '🧠',
    google: '🔍',
  };
  return icons[provider];
}
