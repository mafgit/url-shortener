import { Router } from "express";
import { shorten, visit, health, check_clicks } from "./controller";

const router = Router();

// curl -d "url=https://google.com" http://localhost:5000/shorten
router.post("/shorten", shorten);

// curl http://localhost:5000/v/a
router.get("/v/:code", visit);

router.get('/health', health)

router.get('/clicks/:code', check_clicks)

export default router;