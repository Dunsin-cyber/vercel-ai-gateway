import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize provider instances with API keys from environment variables
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Define provider configuration
const providerConfig = {
  openai: {
    provider: openai,
    model: 'gpt-4-turbo',
    envKey: 'OPENAI_API_KEY',
  },
  anthropic: {
    provider: anthropic,
    model: 'claude-3-5-sonnet-20241022',
    envKey: 'ANTHROPIC_API_KEY',
  },
  google: {
    provider: google,
    model: 'gemini-1.5-pro',
    envKey: 'GOOGLE_GENERATIVE_AI_API_KEY',
  },
};

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { messages, provider: providerName } = body;

    // Validate provider parameter
    if (!providerName || typeof providerName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Provider parameter is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if provider is valid
    if (!['openai', 'anthropic', 'google'].includes(providerName)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid provider: ${providerName}. Must be one of: openai, anthropic, google` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get provider configuration
    const config = providerConfig[providerName as keyof typeof providerConfig];

    // Check if API key is available
    const apiKey = process.env[config.envKey];
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: `API key for ${providerName} is not configured. Please set ${config.envKey} environment variable.` 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages parameter is required and must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream text from the selected provider
    const result = await streamText({
      model: config.provider(config.model),
      messages,
    });

    // Return streaming response using AI SDK format
    return result.toDataStreamResponse();

  } catch (error: any) {
    // Handle provider API failures
    console.error('Chat API error:', error);
    
    // Return appropriate error response
    const errorMessage = error.message || 'An error occurred while processing your request';
    const statusCode = error.statusCode || 500;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.cause || 'Provider API failure'
      }),
      { 
        status: statusCode, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
