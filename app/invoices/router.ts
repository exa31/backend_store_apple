import { Router } from "express";
import { getInvoice } from "./controller";
const router = Router();

router.get("/invoices/:orderId", getInvoice);

export default router;