FROM node:20

WORKDIR /app

COPY package.json package-lock.json .

RUN npm ci

COPY . .

# (for production)
# EXPOSE 3000
# RUN npm run build
# CMD ["npm", "start"]

# (for development)
EXPOSE 3000
CMD ["npm", "run", "dev"]s