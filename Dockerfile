# Multi-stage Dockerfile for VIRALYTICS AI
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build frontend production bundle
RUN npm run build

# Runner stage
FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app /app

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
