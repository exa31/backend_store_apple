import express, { Router, RequestHandler } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "./controller";
import multer from "multer";
import os from "os";
import { checkRole } from "../../middleware";



const router: Router = express.Router();

const upload = multer({ dest: os.tmpdir() });

router.get('/products/:id', getProduct)

router.get('/products', getProducts);

router.post('/products',
    checkRole('admin') as RequestHandler,
    upload.fields([
        { name: 'image_thumbnail' },
        { name: 'image_details' }]),
    createProduct);
router.put('/products/:id',
    checkRole('admin') as RequestHandler,
    upload.fields([
        { name: 'image_thumbnail' },
        { name: 'image_details' }]),
    updateProduct);
router.delete('/products/:id',
    checkRole('admin') as RequestHandler,
    deleteProduct);

export default router;