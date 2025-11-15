# AI Chat Application with Multiple Providers

A Next.js-based chat application that supports multiple AI providers (OpenAI, Anthropic, and Google) with Vercel AI Gateway integration for unified API management, caching, and rate limiting.

## Features

- 🤖 **Multiple AI Provider Support**: Switch between OpenAI, Anthropic (Claude), and Google (Gemini) models
- ⚡ **Vercel AI Gateway Integration**: Built-in caching, rate limiting, and usage analytics
- 🎨 **Modern UI**: Clean, responsive chat interface
- 🔄 **Real-time Streaming**: Streaming responses for better user experience
- 🔒 **Secure**: Environment-based API key management

## Prerequisites

Before deploying this application, ensure you have:

- A [Vercel](https://vercel.com) account
- API keys from at least one AI provider:
  - [OpenAI API Key](https://platform.openai.com/api-keys)
  - [Anthropic API Key](https://console.anthropic.com/)
  - [Google AI API Key](https://makersuite.google.com/app/apikey)

## Environment Variables

This application requires the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Optional* |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Optional* |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google AI API key | Optional* |

*At least one API key must be provided for the application to function.

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

Edit `.env.local` and add your API keys:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
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
   - Add the following variables:
     - `OPENAI_API_KEY` → Your OpenAI API key
     - `ANTHROPIC_API_KEY` → Your Anthropic API key
     - `GOOGLE_GENERATIVE_AI_API_KEY` → Your Google AI API key
   - Make sure to add them for all environments (Production, Preview, Development)

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
   vercel env add OPENAI_API_KEY
   vercel env add ANTHROPIC_API_KEY
   vercel env add GOOGLE_GENERATIVE_AI_API_KEY
   ```

## Enabling Vercel AI Gateway

Vercel AI Gateway provides enhanced features like caching, rate limiting, and analytics for your AI API calls.

### Steps to Enable:

1. **Navigate to Your Project Settings**
   - Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
   - Click on "Settings" tab

2. **Access AI Configuration**
   - In the left sidebar, find and click on "AI" section
   - This is where you can configure AI Gateway settings

3. **Enable AI Gateway**
   - Toggle "Enable AI Gateway" to ON
   - Configure your preferences:
     - **Caching**: Enable to cache similar requests and reduce API costs
     - **Rate Limiting**: Set limits to prevent abuse
     - **Analytics**: View usage statistics and model performance

4. **Update API Endpoints (if needed)**
   - If using AI Gateway, your API calls will automatically be routed through Vercel's gateway
   - No code changes required if using Vercel AI SDK

5. **Redeploy**
   - After enabling AI Gateway, redeploy your application for changes to take effect
   ```bash
   vercel --prod
   ```

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
4. **Verify error handling**: Try switching to a provider without an API key configured to ensure proper error messages

### 4. Monitor AI Gateway (if enabled)

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

## Troubleshooting

### API Key Not Working

- **Issue**: "Invalid API key" error
- **Solution**: 
  - Verify the API key is correctly copied (no extra spaces)
  - Ensure the key is active and not revoked
  - Check that the key has sufficient credits/quota
  - Redeploy after updating environment variables in Vercel

### Provider Not Available

- **Issue**: Certain AI provider is grayed out or not working
- **Solution**:
  - Verify the corresponding API key is set in environment variables
  - Check Vercel deployment logs for errors
  - Ensure the API key has access to the requested model

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
- ✅ **Rotate API keys regularly** and after any suspected exposure
- ✅ **Set up rate limiting** via AI Gateway to prevent abuse
- ✅ **Monitor usage** regularly through provider dashboards and Vercel Analytics
- ✅ **Implement authentication** for production applications (not included in basic setup)

## Cost Management

- **Use AI Gateway caching** to reduce duplicate API calls
- **Set rate limits** to prevent unexpected costs
- **Monitor usage** through Vercel Analytics and provider dashboards
- **Start with lower-cost models** (e.g., GPT-3.5-turbo, Claude Instant) for testing
- **Set up billing alerts** in your AI provider accounts

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
