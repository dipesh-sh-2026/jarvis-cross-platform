# Production Dockerfile for Jarvis AI Assistant Ecosystem
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source files
COPY . .

# Expose HTTP & WebSocket Port
EXPOSE 8080

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=8080

# Start Production Mobile API & Web Admin Server
CMD ["node", "mobile_api_server.js"]
