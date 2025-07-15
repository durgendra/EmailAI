# EmailAI

Email ingestion and moderation workflow with an Express API, a SendGrid webhook helper, and OpenAI-powered image analysis.

## About

This repo combines several email-related capabilities: a Node API for user, flagging, and content workflows; a SendGrid-style inbound email endpoint; and an OpenAI vision pipeline that analyzes uploaded images for kid-safe content and generates guided responses.

## Key Features

- Inbound email webhook
- User and content flagging APIs
- OpenAI image analysis with child-safety prompts
- MongoDB-backed data model
- Google sign-in and JWT authentication

## Architecture

- `server/` hosts the main Express API
- `sendgrid/` is a minimal webhook listener for inbound email events
- `server/controllers/` contains the email analysis and moderation logic

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- OpenAI
- Gmail/IMAP-style mailbox polling
- SendGrid webhook handling

## Prerequisites

- Node.js
- MongoDB
- OpenAI API key
- Google OAuth client ID

## Installation

```bash
cd server && npm install
cd ../sendgrid && npm install
```

## Configuration

- Server: `PORT`, `CLIENT_URL`, `MONGO_CONNECT`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `OPENAI_API_KEY`
- SendGrid helper: no env vars are referenced in the current code

## How to Run

```bash
cd server
npm start

cd ../sendgrid
npm start
```

## Example Usage

- Send inbound mail payloads to the webhook listener
- Use the main API to create and flag content records

## Project Structure

- `server/routes/` - API route groups
- `server/controllers/` - request handling and OpenAI analysis
- `sendgrid/index.js` - inbound email endpoint

## Current Status

Experimental and not publication-ready yet. The repo contains a hard-coded mailbox credential in the server startup code, so it needs cleanup before public release.

## Limitations

- Sensitive mailbox configuration is embedded in source
- No root env example
- No repo-level license

## License

No explicit license file was found at the repository root.
