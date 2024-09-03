import express, { Router, } from "express";
import { addProductToCart, getCart, reduceProductCart, removeProductFromCart } from "./controller";
const router: Router = express.Router();

router.get('/carts', getCart);
router.post('/carts', addProductToCart);
router.post('/carts/reduce', reduceProductCart);
router.post('/carts/remove', removeProductFromCart);

export default router;