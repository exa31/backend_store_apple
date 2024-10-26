"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os"));
const middleware_1 = require("../../middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: os_1.default.tmpdir() });
router.get('/products/:id', controller_1.getProduct);
router.get('/products', controller_1.getProducts);
router.post('/products', (0, middleware_1.checkRole)('admin'), upload.fields([
    { name: 'image_thumbnail' },
    { name: 'image_details' }
]), controller_1.createProduct);
router.put('/products/:id', (0, middleware_1.checkRole)('admin'), upload.fields([
    { name: 'image_thumbnail' },
    { name: 'image_details' }
]), controller_1.updateProduct);
router.delete('/products/:id', (0, middleware_1.checkRole)('admin'), controller_1.deleteProduct);
exports.default = router;
