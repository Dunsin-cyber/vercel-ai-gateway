/**
 * Chat API Route - Vercel AI Gateway Integration
 * 
 * This API endpoint handles chat requests and routes them through Vercel AI Gateway
 * to access multiple AI providers (OpenAI, Anthropic, Google) with unified authentication.
 * 
 * Required Environment Variables:
 * - VERCEL_AI_GATEWAY_KEY: Your gateway API key for authentication
 * - VERCEL_AI_GATEWAY_ID: Your unique gateway identifier from Vercel Dashboard
 * 
 * For setup instructions, see: VERCEL_AI_GATEWAY_SETUP.md
 */

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Get gateway configuration from environment variables
// These should be set in your .env.local file or Vercel project settings
const GATEWAY_ID = process.env.VERCEL_AI_GATEWAY_ID;
const GATEWAY_KEY = process.env.VERCEL_AI_GATEWAY_KEY;

/**
 * Constructs the gateway URL for a specific provider
 * Vercel AI Gateway URL format: https://gateway.vercel.com/v1/{gateway-id}/{provider}
 * 
 * @param provider - The AI provider name (e.g., 'openai', 'anthropic', 'google-ai')
 * @returns Gateway URL if GATEWAY_ID is configured, undefined otherwise (uses default provider URL)
 */
const getGatewayURL = (provider: string): string | undefined => {
  if (GATEWAY_ID) {
    return `https://gateway.vercel.com/v1/${GATEWAY_ID}/${provider}`;
  }
  // If no GATEWAY_ID, return undefined to use default provider endpoints
  return undefined;
};

// Initialize provider instances with Vercel AI Gateway
// The baseURL routes requests through your Vercel AI Gateway
// The apiKey (GATEWAY_KEY) authenticates with the gateway
const openai = createOpenAI({
  apiKey: GATEWAY_KEY,
  baseURL: getGatewayURL('openai'),
});

const anthropic = createAnthropic({
  apiKey: GATEWAY_KEY,
  baseURL: getGatewayURL('anthropic'),
});

const google = createGoogleGenerativeAI({
  apiKey: GATEWAY_KEY,
  baseURL: getGatewayURL('google-ai'), // Note: Google uses 'google-ai' in the gateway URL
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

    // Check if Vercel AI Gateway is properly configured
    if (!GATEWAY_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Vercel AI Gateway key is not configured. Please set VERCEL_AI_GATEWAY_KEY environment variable.',
          help: 'Get your gateway key from: https://vercel.com/docs/integrations/ai'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Warn if Gateway ID is not set (optional but recommended)
    if (!GATEWAY_ID) {
      console.warn('VERCEL_AI_GATEWAY_ID is not set. Using gateway key directly. For better routing, set your gateway ID from Vercel dashboard.');
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
