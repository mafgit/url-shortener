FROM node:20
# node:20 is the base docker image that has npm and node v20 preinstalled

# container's directory will be:
WORKDIR /app

# copy everthing from local to container directory
COPY . .

# RUN is to run commands required when building an image
RUN npm ci
# instead of npm install because faster, more reliable, exact, deterministic

# CMD is to run commands when container is running
CMD ["npm", "run", "start"]