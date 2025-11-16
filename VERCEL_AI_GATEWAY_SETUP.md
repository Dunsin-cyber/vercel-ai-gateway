# Vercel AI Gateway Setup Guide

This guide will help you properly configure Vercel AI Gateway for your chat application.

## What is Vercel AI Gateway?

Vercel AI Gateway is a unified API gateway that provides:
- Single API endpoint for multiple AI providers (OpenAI, Anthropic, Google, etc.)
- Centralized authentication and rate limiting
- Request caching to reduce costs
- Analytics and monitoring
- Cost management across providers

## Prerequisites

- A Vercel account
- A deployed or local Vercel project
- Access to Vercel Dashboard

## Step-by-Step Setup

### 1. Access Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project (or create a new one)

### 2. Create an AI Gateway

1. In your project dashboard, navigate to **Settings**
2. Look for **Integrations** in the sidebar
3. Find the **AI** or **AI Gateway** section
4. Click **Create Gateway** or **Enable AI Gateway**

### 3. Configure Your Gateway

1. Give your gateway a unique ID/name (e.g., `my-chat-gateway`, `production-ai`)
2. Configure providers you want to use:
   - OpenAI
   - Anthropic (Claude)
   - Google AI (Gemini)
3. Set up any rate limits or caching rules (optional)
4. Save your configuration

### 4. Get Your Gateway Credentials

After creating your gateway, you'll receive:

1. **Gateway ID**: A unique identifier for your gateway
   - Example: `my-chat-gateway` or `prod-ai-gateway`
   - This will be used in the gateway URL

2. **Gateway API Key/Token**: Your authentication token
   - This is a secret key used to authenticate requests
   - Treat this like a password - keep it secure!

### 5. Configure Environment Variables

#### For Local Development:

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   VERCEL_AI_GATEWAY_KEY=your_actual_gateway_api_key_here
   VERCEL_AI_GATEWAY_ID=your_actual_gateway_id_here
   ```

#### For Production (Vercel Deployment):

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - **Name**: `VERCEL_AI_GATEWAY_KEY`
     - **Value**: Your gateway API key
     - **Environments**: Production, Preview, Development (select all)
   
   - **Name**: `VERCEL_AI_GATEWAY_ID`
     - **Value**: Your gateway ID
     - **Environments**: Production, Preview, Development (select all)

4. Click **Save** for each variable

### 6. Redeploy Your Application

If your app is already deployed:

```bash
# Using Vercel CLI
vercel --prod

# Or just push to your Git repository
git push
```

Vercel will automatically redeploy with the new environment variables.

### 7. Test Your Configuration

1. Open your application
2. Try sending a message with each provider (OpenAI, Anthropic, Google)
3. Check that responses are coming through correctly
4. Look for any error messages in the chat interface

## Troubleshooting

### Error: "Vercel AI Gateway key is not configured"

**Solution**: Make sure you've set the `VERCEL_AI_GATEWAY_KEY` environment variable correctly.

1. Check that the variable name is exactly `VERCEL_AI_GATEWAY_KEY` (case-sensitive)
2. Verify there are no extra spaces before or after the key
3. If deployed on Vercel, make sure you've added it to all environments
4. Try redeploying after adding the variable

### Error: "Failed to get response from AI provider"

**Possible Causes**:

1. **Gateway ID is incorrect or missing**
   - Verify your `VERCEL_AI_GATEWAY_ID` matches the ID in your Vercel dashboard
   - Check for typos

2. **Gateway API Key is invalid**
   - Regenerate the key in Vercel Dashboard if needed
   - Update the `VERCEL_AI_GATEWAY_KEY` variable

3. **Gateway not properly configured**
   - Ensure the providers (OpenAI, Anthropic, Google) are enabled in your gateway
   - Check that your gateway is active/enabled

4. **Network/CORS issues**
   - Verify your gateway allows requests from your domain
   - Check Vercel function logs for detailed errors

### Error: "VERCEL_AI_GATEWAY_ID is not set" (Warning)

**Note**: This is just a warning. The app might still work if your gateway key is configured to work without a gateway ID. However, for proper routing, you should:

1. Add the `VERCEL_AI_GATEWAY_ID` environment variable
2. Set it to your gateway's unique identifier
3. Redeploy the application

### How to View Detailed Errors

1. **In Browser**: Open DevTools (F12) → Console tab
2. **In Vercel**: 
   - Go to your project dashboard
   - Click on **Functions** or **Logs**
   - Look for error messages from the `/api/chat` function

## Gateway URL Format

Your application constructs gateway URLs as:

```
https://gateway.vercel.com/v1/{GATEWAY_ID}/{provider}
```

For example:
- OpenAI: `https://gateway.vercel.com/v1/my-gateway/openai`
- Anthropic: `https://gateway.vercel.com/v1/my-gateway/anthropic`
- Google AI: `https://gateway.vercel.com/v1/my-gateway/google-ai`

## Monitoring and Analytics

After setting up your gateway:

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Analytics** → **AI** (or **Gateway**)
3. View metrics:
   - Request count per provider
   - Cache hit rates
   - Response times
   - Costs breakdown
   - Error rates

## Security Best Practices

1. **Never commit `.env.local`** to version control
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Rotate keys regularly**
   - Generate new gateway API keys periodically
   - Update environment variables after rotation

3. **Use environment-specific gateways**
   - Different gateways for development, staging, production
   - Helps isolate environments and track usage separately

4. **Set rate limits**
   - Configure rate limits in gateway settings
   - Prevents abuse and unexpected costs

## Alternative: Using Provider APIs Directly

If you prefer not to use Vercel AI Gateway, you can also use provider APIs directly:

1. Remove or don't set `VERCEL_AI_GATEWAY_ID`
2. Set provider-specific API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_AI_API_KEY=your_google_key
   ```
3. Modify `app/api/chat/route.ts` to use these keys instead

## Support Resources

- [Vercel AI Gateway Documentation](https://vercel.com/docs/integrations/ai)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Vercel Support](https://vercel.com/support)

## Quick Checklist

- [ ] Created AI Gateway in Vercel Dashboard
- [ ] Obtained Gateway ID
- [ ] Obtained Gateway API Key
- [ ] Set `VERCEL_AI_GATEWAY_KEY` environment variable
- [ ] Set `VERCEL_AI_GATEWAY_ID` environment variable
- [ ] Redeployed application (if already deployed)
- [ ] Tested all three providers (OpenAI, Anthropic, Google)
- [ ] Verified responses are working correctly
- [ ] Set up monitoring/analytics (optional)

---

If you're still experiencing issues after following this guide, please check:
1. Vercel function logs for detailed error messages
2. Browser console for client-side errors
3. Ensure all environment variables are set correctly (no typos, extra spaces)
4. Try regenerating your gateway API key
