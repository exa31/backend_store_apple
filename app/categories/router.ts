import express, { Router, RequestHandler } from "express";
import { checkRole } from "../../middleware";
import { getCategory, getCategories, createCategory, deleteCategory, updateCategory } from "./controller";

const router: Router = express.Router();

router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', checkRole('admin') as RequestHandler, createCategory);
router.put('/categories/:id', checkRole('admin') as RequestHandler, updateCategory);
router.delete('/categories/:id', checkRole('admin') as RequestHandler, deleteCategory)

export default router;
