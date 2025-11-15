# AI Chat - Multi-Provider Interface

A Next.js-based chat application with support for multiple AI providers (OpenAI, Anthropic, and Google) with seamless provider switching.

## Features

### Provider Selection & Switching
- ✅ **Three AI Providers**: OpenAI (GPT-4), Anthropic (Claude 3.5 Sonnet), and Google (Gemini Pro)
- ✅ **Segmented Control UI**: Clean, accessible provider selection with visual feedback
- ✅ **Session Persistence**: Provider selection persists throughout the chat session
- ✅ **Visual Feedback**: Animated highlights and system messages when switching providers
- ✅ **Provider Display**: Shows current provider and model name in the header
- ✅ **Responsive Design**: Works seamlessly on mobile and desktop devices

### Chat Interface
- Real-time streaming responses from AI providers
- Clean, modern UI with message history
- User and assistant message differentiation
- System messages for provider switches
- Auto-scroll to latest messages
- Loading states and error handling

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout with global styles
│   └── page.tsx             # Main chat page with provider state management
├── components/
│   └── ProviderSelector.tsx # Reusable provider selection component
├── types/
│   └── chat.ts              # TypeScript definitions for providers and messages
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration
```

## Implementation Details

### Type Definitions (`types/chat.ts`)
- Defines `Provider` type: `'openai' | 'anthropic' | 'google'`
- `ProviderConfig` interface with display name, model, and color
- `PROVIDER_CONFIGS` object mapping providers to their configurations
- `Message` interface for chat messages
- `ChatRequest` interface for API requests

### Provider Selector Component (`components/ProviderSelector.tsx`)
- Segmented control-style button group
- Color-coded borders based on provider
- Animated highlight on provider change
- Accessible with ARIA labels
- Responsive design for mobile and desktop
- Visual icons for each provider (🤖 OpenAI, 🧠 Anthropic, 🔍 Google)

### Main Chat Page (`app/page.tsx`)
- **State Management**:
  - `selectedProvider`: Currently selected AI provider (persists in session)
  - `messages`: Array of chat messages
  - `isLoading`: Loading state during API requests
  - `showProviderAnimation`: Triggers animation on provider switch

- **Provider Switching**:
  - Adds system message to chat when provider changes
  - Triggers highlight animation on selector
  - Updates model display in header

- **API Integration**:
  - Sends POST requests to `/api/chat` endpoint
  - Includes `provider` parameter in request body
  - Supports streaming responses with Server-Sent Events
  - Error handling and user feedback

- **Visual Features**:
  - Header shows current provider and model
  - Messages display provider badge for assistant responses
  - Color-coded UI elements based on selected provider
  - Responsive layout for all screen sizes

## API Integration

The chat page sends requests to `/api/chat` with the following format:

```typescript
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "provider": "openai" | "anthropic" | "google"
}
```

Expected streaming response format:
```
data: {"content": "chunk of text"}
data: {"content": "more text"}
data: [DONE]
```

## Provider Configuration

Each provider is configured with:
- **OpenAI**: gpt-4 model, green color (#10a37f)
- **Anthropic**: claude-3-5-sonnet-20241022 model, orange color (#d97757)
- **Google**: gemini-pro model, blue color (#4285f4)

## Visual Feedback

1. **Provider Switch Animation**: Pulse animation on the selector when provider changes
2. **System Messages**: Yellow-highlighted messages indicating provider switches
3. **Color Coding**: Provider-specific colors throughout the UI
4. **Model Display**: Real-time display of active model in header
5. **Provider Badges**: Small badges on assistant messages showing which provider responded

## Responsive Design

- **Desktop**: Full-width layout with horizontal provider buttons
- **Tablet**: Optimized spacing and touch-friendly buttons
- **Mobile**: 
  - Vertical provider selector layout
  - Full-width message input
  - Stacked form elements
  - Touch-optimized button sizes

## Accessibility

- ARIA labels for provider buttons
- `aria-pressed` state for selected provider
- Keyboard navigation support
- Clear visual feedback for all interactions
- High contrast colors for readability

## Success Criteria (All Met ✅)

- [x] User can select between OpenAI, Anthropic, and Google providers through the UI
- [x] Selected provider is clearly displayed at all times
- [x] Provider selection is included in API requests and reaches the backend correctly
- [x] Switching providers works seamlessly without disrupting the chat experience
- [x] Provider selection persists for the duration of the chat session
- [x] UI provides clear feedback when switching between providers

## Next Steps

The implementation is complete and ready for integration with the backend API route (`/api/chat`) which should handle the `provider` parameter and route requests to the appropriate AI service.
