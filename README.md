# OpenCode Chat Application

A full-stack chat application powered by OpenCode and Big Pickle, separated into backend and frontend services for independent deployment.

## Architecture

This application is split into three separate services:

### Server: `server/`
- **Technology**: OpenCode server
- **Deployment**: Docker container
- **Purpose**: Core AI chat server that processes messages
- **Dependencies**: OpenCode server dependencies

### Backend: `opencode-next-api/`
- **Technology**: Next.js API server
- **Deployment**: Docker container
- **Purpose**: Provides `/api/chat` endpoint that proxies requests to the OpenCode server
- **Dependencies**: `@opencode-ai/sdk`, `next`
- **Note**: This service makes API calls to the OpenCode server at `https://strejda.onrender.com`

### Frontend: `front-end-ui/`
- **Technology**: Next.js React application
- **Deployment**: Netlify (static build)
- **Purpose**: User interface for chat application
- **Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

## Development Setup

### Server Development
```bash
cd server
# Follow the server's README for setup instructions
# The server should be running at https://strejda.onrender.com or your local instance
```

### Backend Development
```bash
cd opencode-next-api
npm install
npm run dev
```
The API will be available at `http://localhost:3000/api/chat`

### Frontend Development
```bash
cd front-end-ui
npm install
cp .env.example .env.local
# Edit .env.local to set NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```
The frontend will be available at `http://localhost:3001`

## Deployment

### Server (Docker)
```bash
cd server
docker-compose up -d
# Or follow the server's deployment instructions
```

### Backend (Docker)
```bash
cd opencode-next-api
docker build -t opencode-next-api .
docker run -p 3000:3000 opencode-next-api
```

### Frontend (Netlify)
1. Connect the `front-end-ui` directory to Netlify
2. Set environment variable `NEXT_PUBLIC_API_URL` to your deployed backend URL
3. Deploy - Netlify will automatically build and deploy the static site

## Environment Variables

### Server
Refer to the server's documentation for required environment variables.

### Backend
No required environment variables for basic functionality.
- Note: The backend is configured to connect to `https://strejda.onrender.com` by default in `opencode-next-api/app/api/chat/route.ts:6`

### Frontend
- `NEXT_PUBLIC_API_URL`: URL of the deployed backend API (e.g., `https://your-backend-url.com`)

## API Endpoint

### POST /api/chat
Request body:
```json
{
  "message": "Your message here"
}
```

Response:
```json
{
  "response": "AI response here"
}
```

## Service Dependencies

**Important**: All three services must be running for the application to work correctly:

1. **Server** - The OpenCode AI server that processes chat messages
2. **Backend API** - The Next.js API that proxies requests to the server
3. **Frontend** - The React UI that users interact with

The backend API (`opencode-next-api/app/api/chat/route.ts`) makes HTTP calls to the OpenCode server, so the server must be accessible at the configured URL.

## Original Project Structure

This was originally a single Next.js application that has been separated into three services for better scalability and independent deployment capabilities.