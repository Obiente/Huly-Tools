FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Remove dev dependencies and source files
RUN npm prune --production && rm -rf src tsconfig.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S huly -u 1001

# Change ownership of the app directory
RUN chown -R huly:nodejs /app
USER huly

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
