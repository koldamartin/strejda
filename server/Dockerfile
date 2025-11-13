# Use Node.js LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install OpenCode globally
# Note: Replace with actual installation method once OpenCode is published to npm
# For now, assuming it can be installed via npm
RUN npm install -g @opencode/cli || npm install -g opencode

# Set environment variables
ENV PORT=4096
ENV HOSTNAME=0.0.0.0

# Expose the default OpenCode server port
EXPOSE 4096

# Health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4096/doc || exit 1

# Create a non-root user for security
RUN addgroup -g 1001 -S opencode && \
    adduser -S opencode -u 1001

# Switch to non-root user
USER opencode

# Start the OpenCode server
CMD ["sh", "-c", "opencode serve --port ${PORT} --hostname ${HOSTNAME}"]
