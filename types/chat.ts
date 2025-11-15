export type Provider = 'openai' | 'anthropic' | 'google';

export interface ProviderConfig {
  name: string;
  displayName: string;
  model: string;
  color: string;
}

export const PROVIDER_CONFIGS: Record<Provider, ProviderConfig> = {
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    model: 'gpt-4',
    color: '#10a37f',
  },
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic',
    model: 'claude-3-5-sonnet-20241022',
    color: '#d97757',
  },
  google: {
    name: 'google',
    displayName: 'Google',
    model: 'gemini-pro',
    color: '#4285f4',
  },
};

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider?: Provider;
  timestamp: number;
}

export interface ChatRequest {
  messages: Message[];
  provider: Provider;
}
