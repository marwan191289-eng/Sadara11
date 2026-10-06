# Multi-stage Docker build for Course Manager Pro (Sadara Platform)
# Stage 1: Build environment
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy application sources
COPY . .

# Build for production output directory (dist)
RUN npm run build

# Stage 2: Production runner environment
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install minimal static server or use express if needed
RUN npm install -g serve

# Copy compiled production assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Start production server serving dist on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
