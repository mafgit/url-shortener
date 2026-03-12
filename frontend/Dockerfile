FROM node:20

WORKDIR /app

COPY package.json package-lock.json .

RUN npm ci

COPY . .

# (for production)
# RUN npm run build
# CMD ["npm", "start"]

# (for development)
CMD ["npm", "run", "dev"]s