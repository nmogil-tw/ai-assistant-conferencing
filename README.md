# Voice Channel Functions

This directory contains Twilio Functions that handle voice calls and conference management for an automated customer service system with AI assistant and human escalation capabilities.

## Functions Overview

[![](https://mermaid.ink/img/pako:eNp1Uk1PAjEQ_SuTOSMCLnS3MSQETOSiRj2ZvdRtgY27LfZDRcJ_d9YFFgR7aGb65s3Hm64xM1IhR6feg9KZmuRibkWZaqCzFNbnWb4U2sM4OG9KZU-R58-8yM0ZhtEzZaukp9hoCiPncufJOUVvQyk0jOaqAmt4V_5iOKzrcZjqVxO0hLEoijqoRiikKc1hbJXw6qSbxqf4w3Z4BWmVnWuyvu8M5TMfysJRnb0NT9MJZL9l5fWrvRzOjAW_UOAUpTP6MJdZerhxmSiEJwQeqzU44tVodQ67-DPaNnqrV5OmIR9NeSArB1p0AffBgzc7pXek8_ONpKwDQTh4aLb1T7FjSSe5y_aq1gylJbaQVlqKXNIPXFfPKZJOpUqRkymFfUsx1RuKE8Gbp5XOkHsbVAutCfMF8pkoHHlhKUns7d_dv1J3L8aUOwq5yNf4hTzqtNkVY1EUR3F_0Eu6LVwhj5N2HHUSxgasy3rdfm_Twu9ffqedJBHrd_usN-jEZMabH75uDhI?type=png)](https://mermaid.live/edit#pako:eNp1Uk1PAjEQ_SuTOSMCLnS3MSQETOSiRj2ZvdRtgY27LfZDRcJ_d9YFFgR7aGb65s3Hm64xM1IhR6feg9KZmuRibkWZaqCzFNbnWb4U2sM4OG9KZU-R58-8yM0ZhtEzZaukp9hoCiPncufJOUVvQyk0jOaqAmt4V_5iOKzrcZjqVxO0hLEoijqoRiikKc1hbJXw6qSbxqf4w3Z4BWmVnWuyvu8M5TMfysJRnb0NT9MJZL9l5fWrvRzOjAW_UOAUpTP6MJdZerhxmSiEJwQeqzU44tVodQ67-DPaNnqrV5OmIR9NeSArB1p0AffBgzc7pXek8_ONpKwDQTh4aLb1T7FjSSe5y_aq1gylJbaQVlqKXNIPXFfPKZJOpUqRkymFfUsx1RuKE8Gbp5XOkHsbVAutCfMF8pkoHHlhKUns7d_dv1J3L8aUOwq5yNf4hTzqtNkVY1EUR3F_0Eu6LVwhj5N2HHUSxgasy3rdfm_Twu9ffqedJBHrd_usN-jEZMabH75uDhI)

### Voice Channel Functions

#### 1. assistant-call-conference.js
Handles the AI assistant's participation in conference calls:
- Manages the AI assistant's connection to conferences
- Configures voice settings and behavior
- Handles assistant-specific conference parameters

#### 2. customer-dial-conference.js
Manages conference call setup when a customer dials in:
- Creates a new conference using the CallSid as identifier
- Sets appropriate time limits
- Configures conference parameters:
  - Records from start
  - Ends when initiator leaves
  - Labels participant as 'customer'
  - Monitors conference events through status callbacks

#### 3. conference-status-callback.js
Handles conference status events and participant management:
- Processes conference event callbacks (start, join, leave)
- Manages participant labels ('customer', 'agent')
- Handles dynamic addition of AI assistant
- Tracks call details and participant information
- Manages conference state and routing

### Tools

#### escalate-to-human-conference.js
Manages the escalation process from AI to human agent:
- Extracts session information from call headers
- Identifies active customer conferences
- Manages the transition from AI to human agent
- Handles conference participant updates
- Ensures smooth handover process

## System Flow

1. Customer initiates call
2. Call is placed into conference via `customer-dial-conference.js`
3. AI assistant joins via `assistant-call-conference.js`
4. Conference events managed by `conference-status-callback.js`
5. Optional escalation to human agent via `escalate-to-human-conference.js`

## Configuration Requirements

Required environment variables:
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `ASSISTANT_ID`: Your AI Assistant ID
- `FUNCTIONS_DOMAIN`: Your Twilio Functions domain
- `AI_ASSISTANT_PHONE_NUMBER`: Phone number for AI assistant

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
2. Fill in your environment variables in the `.env` file with the required values listed above

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

After successful deployment, the Functions domain URL will be displayed in the console. Use this URL to configure your Twilio phone numbers or other services that need to interact with these functions.
