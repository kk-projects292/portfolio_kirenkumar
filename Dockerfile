# Use an Alpine-based Node image for a small production image
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production

# Copy backend source and reuse installed modules
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
COPY backend/ ./
COPY --from=backend-deps /app/backend/node_modules ./node_modules

# Final runtime image
FROM node:20-alpine AS app
WORKDIR /app/backend
COPY --from=backend-build /app/backend .

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
