# Voice Channel Functions

This directory contains Twilio Functions that handle voice calls and conference management for an automated customer service system.

## Function Overview

### 1. incoming-call-conference.js
Handles the initial incoming call setup and configures the AI assistant:
- Validates ASSISTANT_ID configuration
- Connects caller to an AI assistant named "Alice"
- Uses Deepgram for transcription
- Uses Elevenlabs for text-to-speech with the "Jessica-flash_v2_5" voice
- Provides a customized welcome greeting

### 2. customer-dial-conference.js
Manages conference call setup when a customer dials in:
- Creates a new conference using the CallSid as identifier
- Sets a 180-second time limit
- Configures conference parameters:
  - Records from start
  - Ends when initiator leaves
  - Labels participant as 'customer'
  - Monitors conference events through status callbacks

### 3. conference-status-callback.js
Handles conference status events and participant management:
- Receives callbacks for conference events (start, join)
- Automatically adds AI assistant when customer joins
- Manages different logic for 'customer' and 'agent' participants
- Tracks call details and participant information

## System Flow

1. Customer calls in → `incoming-call-conference.js`
2. Call is placed into conference → `customer-dial-conference.js`
3. System adds AI agent to conference → `conference-status-callback.js`
4. Interaction is recorded and monitored through status callbacks

## Configuration Requirements

- `ASSISTANT_ID`: Required for AI assistant configuration
- `FUNCTIONS_DOMAIN`: Required for status callback URLs
- AI Assistant Phone Number: +18887941151

## Voice Settings

- Transcription Provider: Deepgram
- TTS Provider: Elevenlabs
- Voice: Jessica-flash_v2_5

## Deployment Instructions

### Prerequisites
1. Node.js >= 14.0.0
2. A Twilio account with access to Functions
3. Environment variables configured (see below)

### Environment Setup
1. Copy the `.env.example` file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Fill in your environment variables in the `.env` file:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `ASSISTANT_ID`: Your AI Assistant ID
   - `FUNCTIONS_DOMAIN`: Your Twilio Functions domain (optional)

### Installing Dependencies
Install the required dependencies by running:
```bash
npm install
```

### Deployment
There are two ways to deploy the functions:

1. Initial deployment:
   ```bash
   npm run deploy
   ```
   This will create a new service and deploy all functions.

2. Redeploy existing service:
   ```bash
   npm run redeploy
   ```
   Use this for subsequent deployments to update existing functions.

After successful deployment, the Functions domain URL will be displayed in the console. You can use this URL to configure your Twilio phone numbers or other services that need to interact with these functions.
