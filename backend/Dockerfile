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

# to run postgres image: -d detached mode i.e. background to avoid flooding of logs, --name optional container name, -p port mapping local:container, -e environment variable
# docker run -d --name postgres-container -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=urlshortener postgres:16

# to run redis image:
# docker run -d --name redis-container -p 6379:6379 redis:8.6

# to create table etc inside postgres container:
# docker exec -it postgres-container psql -U postgres -d urlshortener
# exec to run command INSIDE container
# -it interactive terminal, otherwise we cant interact in the terminal
# psql is command line tool to interact with postgres
# -U user, -d database name