import express, { Router } from "express";
import { createDeliveryAddress, deleteDeliveryAddress, getDeliveryAddress, getDeliveryAddresses, updateDeliveryAddress } from "./controller";
const router: Router = express.Router();

router.get('/delivery-addresses', getDeliveryAddresses);
router.get('/delivery-addresses/:id', getDeliveryAddress);
router.post('/delivery-addresses', createDeliveryAddress);
router.put('/delivery-addresses/:id', updateDeliveryAddress);
router.delete('/delivery-addresses/:id', deleteDeliveryAddress);

export default router;