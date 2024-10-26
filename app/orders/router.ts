import { Router } from "express";
import { createOrder, getAllOrders, getOrder, getOrders, handleMidtransNotification, updateOrder } from "./controller";
const router = Router();

router.get('/all-orders', getAllOrders);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.post('/orders', createOrder);
router.post('/orders/notification', handleMidtransNotification);
router.put('/orders/:id', updateOrder);

export default router;