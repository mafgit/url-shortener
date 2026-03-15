FROM node:22-alpine

WORKDIR /app

# COPY package.json package-lock.json ./
# when two files copied together in one line, last operand must be directory with a slash
# or use separate lines

COPY package.json .
COPY package-lock.json .
# better leverage of docker cache layering (otherwise one file change -> both files being recopied)

RUN npm ci

COPY . .

# (for production)
# EXPOSE 3000
# RUN npm run build
# CMD ["npm", "start"]

# (for development)
EXPOSE 3000
CMD ["npm", "run", "dev"]