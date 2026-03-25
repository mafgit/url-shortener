FROM node:22-alpine AS builder

WORKDIR /app

# COPY package.json package-lock.json ./
# when two files copied together in one line, last operand must be directory with a slash
# or use separate lines

COPY package.json .
COPY package-lock.json .
# better leverage of docker cache layering (otherwise one file change -> both files being recopied)

RUN npm ci

COPY . .

# declare build argument
ARG NEXT_PUBLIC_BACKEND_URL

# set it to what we receive from docker-compose
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# disable nextjs telemetry for better performance
ENV NEXT_TELEMETRY_DISABLED=1

RUN echo "Building with $NEXT_PUBLIC_BACKEND_URL" && npm run build


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN echo "Testing ls here" && ls -la

# (for production)
EXPOSE 3000
CMD ["node", "server.js"]
# CMD ["npm", "run", "frontend:prod"]

# (for development)
# EXPOSE 3000
# CMD ["npm", "run", "frontend:dev"]