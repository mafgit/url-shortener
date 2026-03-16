import { Router } from "express";
import { shorten, visit, health, checkClicks } from "./controllers";
import { rateLimiter } from "./middlewares";

const router = Router();

// curl -d "url=https://google.com" http://localhost:5000/shorten
router.post("/shorten", rateLimiter, shorten);

// curl http://localhost:5000/v/a
router.get("/v/:code", rateLimiter, visit);

router.get("/clicks/:code", rateLimiter, checkClicks);

router.get("/health", health);

export default router;
