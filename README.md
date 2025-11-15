# AI Chat Application with Multiple Providers

A Next.js-based chat application that provides access to 100+ AI models (OpenAI, Anthropic, Google, and more) through Vercel AI Gateway's unified authentication and management platform.

## Features

- 🤖 **Multiple AI Provider Support**: Switch between OpenAI, Anthropic (Claude), and Google (Gemini) models
- ⚡ **Vercel AI Gateway**: Required gateway providing unified authentication, caching, rate limiting, and usage analytics
- 🎨 **Modern UI**: Clean, responsive chat interface
- 🔄 **Real-time Streaming**: Streaming responses for better user experience
- 🔒 **Secure**: Single gateway key for simplified and secure authentication

## Prerequisites

Before deploying this application, ensure you have:

- A [Vercel](https://vercel.com) account
- A Vercel AI Gateway API key:
  - [Vercel AI Gateway Documentation](https://vercel.com/docs/ai-gateway)
  - [Get your Gateway API key from Vercel Dashboard](https://vercel.com/dashboard)

## Environment Variables

This application requires the following environment variable:

| Variable | Description | Required |
|----------|-------------|----------|
| `VERCEL_AI_GATEWAY_KEY` | Single API key providing access to 100+ AI models through Vercel AI Gateway | Yes |

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Vercel AI Gateway key:

```env
VERCEL_AI_GATEWAY_KEY=your_vercel_gateway_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Your Repository**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository (GitHub, GitLab, or Bitbucket)

2. **Configure Environment Variables**
   - During import or in Project Settings → Environment Variables
   - Add the following variable:
     - `VERCEL_AI_GATEWAY_KEY` → Your Vercel AI Gateway API key
   - Make sure to add it for all environments (Production, Preview, Development)

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically detect Next.js and use the correct build settings
   - Wait for deployment to complete (usually 1-2 minutes)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add VERCEL_AI_GATEWAY_KEY
   ```

## Vercel AI Gateway Configuration

Vercel AI Gateway is **required** for this application to function. It serves as the unified authentication mechanism providing access to 100+ AI models (OpenAI, Anthropic, Google, and more) through a single API key, while also delivering enhanced features like caching, rate limiting, and analytics.

### Why Vercel AI Gateway?

- **Unified Authentication**: Single API key replaces the need for separate keys from each AI provider
- **Simplified Management**: No need to manage multiple API keys and credentials
- **Cost Optimization**: Built-in caching reduces redundant API calls and costs
- **Rate Limiting**: Protect your application from abuse and unexpected usage spikes
- **Analytics & Monitoring**: Track usage, performance, and costs across all AI providers in one dashboard
- **100+ Models**: Access to a wide range of AI models without individual provider integrations

### Steps to Set Up:

1. **Navigate to Your Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project (or create a new one)

2. **Access AI Gateway Settings**
   - In the left sidebar, find and click on the "AI" section
   - This is where you'll configure your AI Gateway

3. **Enable AI Gateway**
   - Toggle "Enable AI Gateway" to ON
   - Configure your preferences:
     - **Caching**: Enable to cache similar requests and reduce API costs
     - **Rate Limiting**: Set limits to prevent abuse and control costs
     - **Analytics**: View usage statistics and model performance metrics

4. **Obtain Your Gateway API Key**
   - In the AI Gateway settings, you'll find your unique API key
   - This key provides authentication to access all supported AI models
   - Copy this key to use in your environment variables

5. **Configure Environment Variable**
   - Add the key to your project's environment variables:
     - In Vercel Dashboard: Settings → Environment Variables → Add `VERCEL_AI_GATEWAY_KEY`
     - Or via CLI: `vercel env add VERCEL_AI_GATEWAY_KEY`
   - Make sure to add it for all environments (Production, Preview, Development)

6. **Deploy Your Application**
   - Deploy or redeploy your application for the changes to take effect
   ```bash
   vercel --prod
   ```

### Accessing AI Gateway Features

Once configured, you can monitor and manage your AI usage:

1. Go to Vercel Dashboard → Your Project → Analytics → AI
2. View:
   - Request count and cache hit rates
   - Response times across providers
   - Costs breakdown by model and provider
   - Usage patterns and trends

## Testing the Application

### 1. Access Your Deployed Application

Once deployed, Vercel will provide you with a URL (e.g., `https://your-app.vercel.app`)

### 2. Test Provider Switching

1. Open the chat interface
2. Look for the provider selector (typically in the UI)
3. Switch between available providers (OpenAI, Anthropic, Google)
4. Verify that each provider responds correctly

### 3. Test Chat Functionality

1. **Send a simple message**: "Hello, how are you?"
2. **Test streaming**: Messages should appear word-by-word in real-time
3. **Test different models**: If your UI supports model selection, try different models from each provider
4. **Verify error handling**: Test error scenarios to ensure proper error messages are displayed

### 4. Monitor AI Gateway Analytics

1. Go to Vercel Dashboard → Your Project → Analytics → AI
2. Monitor:
   - Request count
   - Cache hit rate
   - Response times
   - Costs per provider

## Project Structure

```
.
├── README.md                 # This file
├── package.json             # Dependencies and scripts
├── vercel.json              # Vercel deployment configuration
├── .env.local.example       # Environment variable template
├── .gitignore               # Git ignore rules
├── next.config.js           # Next.js configuration
├── app/                     # Next.js app directory
│   ├── page.tsx            # Main chat interface
│   ├── layout.tsx          # Root layout
│   └── api/                # API routes
│       └── chat/           # Chat API endpoint
└── components/              # React components
    └── ...                 # UI components
```

## Dependencies and Architecture

This application uses the **Vercel AI SDK** with provider-specific packages for a unified AI integration experience.

### Core Dependencies

- **`ai` (^3.0.0)**: Vercel AI SDK core library providing unified streaming and chat APIs
- **`@ai-sdk/openai` (^0.0.42)**: OpenAI provider integration for the Vercel AI SDK
- **`@ai-sdk/anthropic` (^0.0.33)**: Anthropic (Claude) provider integration for the Vercel AI SDK
- **`@ai-sdk/google` (^0.0.33)**: Google (Gemini) provider integration for the Vercel AI SDK

### Architecture Benefits

✅ **Unified API**: All providers use the same interface through the Vercel AI SDK
✅ **Simplified Integration**: No need for direct provider SDKs (openai, @anthropic-ai/sdk, @google/generative-ai)
✅ **Consistent Streaming**: Single streaming implementation works across all providers
✅ **Easy Provider Switching**: Switch between providers without changing API call patterns
✅ **Future-Proof**: New providers can be added through @ai-sdk/* packages

### Version Compatibility

- The `ai` package version ^3.0.0 is compatible with all `@ai-sdk/*` packages listed above
- The `@ai-sdk/*` packages use semantic versioning independently from the core `ai` package
- When updating, ensure all `@ai-sdk/*` packages are compatible with your `ai` package version

### Migration Notes

This project has been migrated from direct provider SDKs to the unified @ai-sdk/* architecture:
- ❌ **Removed**: `openai`, `@anthropic-ai/sdk`, `@google/generative-ai` (no longer needed)
- ✅ **Added**: `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google` (unified providers)

## Troubleshooting

### API Key Not Working

- **Issue**: "Invalid API key" error
- **Solution**: 
  - Verify the `VERCEL_AI_GATEWAY_KEY` is correctly copied (no extra spaces)
  - Ensure the key is active and not revoked in your Vercel Dashboard
  - Confirm AI Gateway is enabled in your Vercel project settings
  - Redeploy after updating environment variables in Vercel

### Provider Not Available

- **Issue**: Certain AI provider or model is not working
- **Solution**:
  - Verify the `VERCEL_AI_GATEWAY_KEY` is correctly set in environment variables
  - Check Vercel deployment logs for authentication errors
  - Ensure AI Gateway is properly configured in your Vercel Dashboard
  - Verify the specific model is available through Vercel AI Gateway

### Streaming Not Working

- **Issue**: Messages appear all at once instead of streaming
- **Solution**:
  - Verify you're using the Vercel AI SDK correctly
  - Check browser console for errors
  - Ensure Edge Runtime is configured in API routes

### Deployment Fails

- **Issue**: Build fails during Vercel deployment
- **Solution**:
  - Check build logs in Vercel dashboard
  - Verify all dependencies are in `package.json`
  - Ensure Node.js version is compatible (use `engines` field in `package.json`)
  - Clear Vercel cache and redeploy

## Security Best Practices

- ✅ **Never commit `.env.local`** or any file containing API keys
- ✅ **Use environment variables** for all sensitive data
- ✅ **Protect your gateway key**: Treat `VERCEL_AI_GATEWAY_KEY` as highly sensitive
- ✅ **Rotate gateway key regularly** and after any suspected exposure
- ✅ **Set up rate limiting** via AI Gateway to prevent abuse and control costs
- ✅ **Monitor usage** regularly through Vercel AI Gateway Analytics
- ✅ **Implement authentication** for production applications (not included in basic setup)

## Cost Management

- **Use AI Gateway caching** to reduce duplicate API calls
- **Set rate limits** to prevent unexpected costs
- **Monitor usage** through Vercel AI Gateway Analytics dashboard
- **Start with lower-cost models** (e.g., GPT-3.5-turbo, Claude Instant) for testing
- **Track costs** through Vercel AI Gateway's unified cost tracking

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Google AI Documentation](https://ai.google.dev/docs)

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
