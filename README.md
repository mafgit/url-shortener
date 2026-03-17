# URL Shortener (In Progress)

> Basic URL shortener to learn Docker, Job-Queue System & some related system design concepts & tools.

### Tools & Concepts In Plan To Use:

- Docker ✅
    - Learnt and made Dockerfiles and docker-compose.yml file with detailed comments on what I learnt
- Rate Limiting ✅
    - Used Redis's INCR and EX operators for that in an Express middleware
- BullMQ (Redis-Based Queue System) ✅
    - For queuing jobs so that a worker can pick it up and run it separately
    - So that response is sent to the user immediately, and then the database queries afterwards would handled by the worker instead of doing all that in the network request before sending response to user.
    - Alternative: setImmediate in Node.js but it isn't as effective as BullMQ, which can handle retries and queue and worker management, and other stuff.
- Cron Job ✅
    - For scheduling deletion of expired short urls from PostgreSQL
- Load Balancing
- AWS
- Nginx
- Horizontal Scaling
- Read Replica
- Redis + PostgreSQL ✅
- Next.js + Express.js ✅

Frontend:
![Frontend](./readme-images/1.png)

Docker:
![Docker](./readme-images/2.png)
