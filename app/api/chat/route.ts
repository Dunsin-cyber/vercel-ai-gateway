import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize provider instances with Vercel AI Gateway
const openai = createOpenAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY,
  baseURL: 'https://gateway.ai.vercel.com/v1/openai',
});

const anthropic = createAnthropic({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY,
  baseURL: 'https://gateway.ai.vercel.com/v1/anthropic',
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY,
  baseURL: 'https://gateway.ai.vercel.com/v1/google',
});

// Define provider configuration
const providerConfig = {
  openai: {
    provider: openai,
    model: 'gpt-4-turbo',
  },
  anthropic: {
    provider: anthropic,
    model: 'claude-3-5-sonnet-20241022',
  },
  google: {
    provider: google,
    model: 'gemini-1.5-pro',
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

    // Check if Vercel AI Gateway key is available
    if (!process.env.VERCEL_AI_GATEWAY_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Vercel AI Gateway key is not configured. Please set VERCEL_AI_GATEWAY_KEY environment variable.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get provider configuration
    const config = providerConfig[providerName as keyof typeof providerConfig];

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
