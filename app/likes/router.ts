import express from "express";
import type { Router } from "express";
const router: Router = express.Router();

import { getLikes, Likes } from "./controller";

router.get('/likes', getLikes);
router.post('/likes', Likes);

export default router as Router;