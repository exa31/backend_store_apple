import { Router } from "express";
import { getDataDashboard } from "./controller";
const router = Router();

router.get('/dashboard', getDataDashboard);

export default router;