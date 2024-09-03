"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/categories', controller_1.getCategories);
router.get('/categories/:id', controller_1.getCategory);
router.post('/categories', (0, middleware_1.checkRole)('admin'), controller_1.createCategory);
router.put('/categories/:id', (0, middleware_1.checkRole)('admin'), controller_1.updateCategory);
router.delete('/categories/:id', (0, middleware_1.checkRole)('admin'), controller_1.deleteCategory);
exports.default = router;
