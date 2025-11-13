# OpenCode Server

This directory contains the Docker setup for deploying an OpenCode server to cloud platforms like Render.com.

## Overview

The OpenCode server provides HTTP endpoints for:
- Managing sessions and messages
- Running shell commands
- File operations and searching
- Authentication credential management
- Agent management
- Server-sent events streaming

The server exposes an OpenAPI 3.1 specification endpoint at `/doc` for generating SDKs and inspecting data types.

## Quick Start

### Local Development with Docker Compose

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Build and start the server:
```bash
docker-compose up -d
```

3. Access the server at `http://localhost:4096`

4. View the OpenAPI documentation at `http://localhost:4096/doc`

### Local Development without Docker

```bash
# Install OpenCode CLI
npm install -g opencode

# Start the server
opencode serve --port 4096 --hostname 0.0.0.0
```

## Deployment to Render.com

### Prerequisites

- A Render.com account
- This repository connected to your Render account

### Deployment Steps

1. **Create a New Web Service**
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your repository

2. **Configure the Service**
   - **Name**: `opencode-server` (or your preferred name)
   - **Region**: Choose your preferred region
   - **Branch**: Select the branch to deploy (e.g., `main`)
   - **Root Directory**: `server`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Build Context Directory**: `.`

3. **Set Environment Variables**

   In the Render dashboard, add the following environment variables:

   ```
   PORT=4096
   HOSTNAME=0.0.0.0
   NODE_ENV=production
   ```

4. **Configure Health Check** (Optional but recommended)
   - **Health Check Path**: `/doc`
   - This ensures Render knows when your service is ready

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your Docker image
   - Wait for the deployment to complete

6. **Access Your Server**
   - Your server will be available at: `https://your-service-name.onrender.com`
   - API documentation: `https://your-service-name.onrender.com/doc`

### Auto-Deploy

Render automatically deploys when you push to your connected branch. To disable auto-deploy:
- Go to your service settings
- Under "Build & Deploy", toggle off "Auto-Deploy"

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 4096 | The port the server listens on |
| `HOSTNAME` | 0.0.0.0 | The hostname to bind to (use 0.0.0.0 for Docker) |
| `NODE_ENV` | production | Node environment (development/production) |

### Port Configuration

The default port is `4096`. On Render.com, the service will be exposed via HTTPS on port 443, but internally it listens on port 4096.

## Testing

### Health Check

Test if the server is running:
```bash
curl http://localhost:4096/doc
```

### Using Docker

Build the image:
```bash
docker build -t opencode-server .
```

Run the container:
```bash
docker run -p 4096:4096 -e PORT=4096 -e HOSTNAME=0.0.0.0 opencode-server
```

## Troubleshooting

### Port Issues

If you encounter port binding issues:
- Ensure no other service is using port 4096
- Check the `PORT` environment variable is set correctly
- For Docker, ensure the port mapping is correct: `-p HOST_PORT:CONTAINER_PORT`

### Container Not Starting

Check logs:
```bash
# Docker Compose
docker-compose logs -f

# Docker
docker logs <container-id>

# Render.com
Check the logs in your Render dashboard
```

### Health Check Failures

If health checks fail:
- Verify the server is listening on `0.0.0.0` (not `127.0.0.1`)
- Ensure the `/doc` endpoint is accessible
- Check firewall settings

## Architecture

```
┌─────────────────┐
│   Client/TUI    │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│  OpenCode       │
│  Server         │
│  (Port 4096)    │
└─────────────────┘
```

## Additional Resources

- [OpenCode Documentation](https://opencode.ai/docs/server/)
- [Render Docker Documentation](https://render.com/docs/docker)
- [OpenAPI Specification](http://localhost:4096/doc) (when server is running)

## License

See the main repository LICENSE file.
