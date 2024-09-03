import { Router } from "express";
import { createOrder, getOrder, getOrders, handleMidtransNotification } from "./controller";
const router = Router();

router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.post('/orders/notification', handleMidtransNotification);

export default router;