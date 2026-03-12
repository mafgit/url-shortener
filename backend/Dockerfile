FROM node:20
# node:20 is the base docker image that has npm and node v20 preinstalled

# container's directory will be:
WORKDIR /app

# copy everthing from local to container directory
# COPY . .
# rather first copy only package json files and then run npm install and then copy code files
# so that docker is able to prevent dependencies reinstalling each time code changes

# COPY package*.json .
COPY package.json package-lock.json .

# RUN is to run commands required when building an image
RUN npm ci
# instead of npm install because
# ci installs exactly same versions as in lock file, doesnt touch the lock file, but requires the lock file
# so its deterministic, not flexible, which is good

# remaining code files
COPY . .

# (for production)
# EXPOSE 5000
# RUN npm run build
# CMD ["npm", "run", "start"]

# (for development)
EXPOSE 5000
CMD ["npm", "run", "dev"]
# CMD is to run commands when container is running, also only one CMD command can run in a Dockerfile

# ---------------------------------------
# to build an image from scratch (i.e. when using Dockerfile instead of running a directly pulled image):
# docker build -t backend-image . (better to write version too in the name i.e. ...:1.0)
# -t tag to name the image
# . is the directory where Dockerfile is present

# ---------------------------------------
# to run a container based on postgres image
# docker run -d --name postgres-container -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=url-shortener postgres:16
# -d detached mode i.e. background to avoid flooding of logs, --name optional container name, -p port mapping local:container, -e environment variable

# ---------------------------------------
# to run a container of redis image:
# docker run -d --name redis-container -p 6379:6379 redis:8.6

# ---------------------------------------
# to create table etc inside postgres container:
# docker exec -it postgres-container psql -U postgres -d url-shortener
# exec to run command INSIDE container
# -it interactive terminal, otherwise we cant interact in the terminal
# psql is command line tool to interact with postgres
# -U user, -d database name

# ---------------------------------------
# to create a network which each container should share (otherwise errors in connections):
# docker network create my-network
# then use '--network my-network' in docker run commands for each container
# NOW each service/container can access another service/container by using its container name as hostname instead of localhost
# because localhost would mean container calling itself, so it wont find the other service
# connection string format:
# postgresql://user:pw@hostname:port/db
# redis://hostname:port

# ---------------------------------------
# to stop and then delete a container:
# docker stop container-name
# docker rm container-name

# ---------------------------------------
# to inject env file when running:
# docker run --env-file .env.development ...

# ---------------------------------------
# binding container code folder to local folder so that live changes are reflected in the docker image and no need to rebuild image (unless changing package.json or something like that)
# docker run .... -v $(pwd):/app image-name
# only useful in development

# ---------------------------------------
# final:
# docker build -t frontend-image .
# docker build -t backend-image .
# docker network create my-network
# docker run -d --network my-network --name redis-container -p 6379:6379 redis:8.6
# docker run -d --network my-network --name postgres-container -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=url-shortener postgres:16
# docker run -d --network my-network --name backend-container -p 5000:5000 $(pwd):/app backend-image
# docker run -d --network my-network --name frontend-container -p 3000:3000 $(pwd):/app frontend-image
