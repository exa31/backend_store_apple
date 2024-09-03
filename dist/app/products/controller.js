"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const model_1 = __importDefault(require("../categories/model"));
const model_2 = __importDefault(require("./model"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 0, skip = 0, q = '', category = '' } = req.query;
        let filter = {};
        if (q) {
            filter = Object.assign(Object.assign({}, filter), { name: { $regex: new RegExp(q, 'i') } });
        }
        if (category) {
            const categoryFilter = yield model_1.default.findOne({ name: category });
            if (categoryFilter) {
                filter = Object.assign(Object.assign({}, filter), { category: categoryFilter._id });
            }
        }
        const count = yield model_2.default.countDocuments(filter);
        const page = count === 0 ? 1 : Math.ceil(count / 12);
        const products = yield model_2.default.find(filter)
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('category');
        res.status(200).json({ count, page, products });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProducts = getProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield model_2.default.findById(req.params.id).populate('category');
        if (product) {
            res.status(200).json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProduct = getProduct;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const category = yield model_1.default.findOne({ name: payload.category });
        if (!category) {
            res.status(400).json({ message: 'Category not found' });
            return;
        }
        else {
            if (category) {
                payload.category = category._id;
            }
        }
        let image_thumbnail = '';
        let image_detail = [];
        if (req.files && typeof req.files === 'object') {
            const files = req.files;
            if (files.image_thumbnail && files.image_thumbnail.length > 0) {
                const file = files.image_thumbnail[0];
                const tmp_path = file.path;
                const originalExt = file.originalname.split('.').pop();
                const filename = file.filename + '.' + originalExt;
                const target_path = path_1.default.resolve(__dirname, '../../' + `public/images/${filename}`);
                const src = fs_1.default.createReadStream(tmp_path);
                const dest = fs_1.default.createWriteStream(target_path);
                src.pipe(dest);
                image_thumbnail = `/${filename}`;
                src.on('error', () => {
                    if (fs_1.default.existsSync(target_path)) {
                        fs_1.default.unlinkSync(target_path);
                    }
                    dest.end();
                    res.status(500).json({ message: 'Failed to upload image' });
                });
            }
            if (files.image_detail && files.image_detail.length > 0) {
                files.image_detail.forEach((file) => {
                    const tmp_path = file.path;
                    const originalExt = file.originalname.split('.').pop();
                    const filename = file.filename + '.' + originalExt;
                    const target_path = path_1.default.resolve(__dirname, '../../' + `public/images/${filename}`);
                    const src = fs_1.default.createReadStream(tmp_path);
                    const dest = fs_1.default.createWriteStream(target_path);
                    src.pipe(dest);
                    image_detail.push(`/${filename}`);
                    src.on('error', () => {
                        if (fs_1.default.existsSync(target_path)) {
                            fs_1.default.unlinkSync(target_path);
                        }
                        dest.end();
                        res.status(500).json({ message: 'Failed to upload image' });
                    });
                });
            }
        }
        const product = new model_2.default(Object.assign(Object.assign({}, req.body), { image_thumbnail, image_details: image_detail }));
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield model_2.default.findById(req.params.id);
        if (product) {
            const payload = req.body;
            if (payload.category) {
                const category = yield model_1.default.findOne({ name: payload.category });
                if (!category) {
                    res.status(400).json({ message: 'Category not found' });
                    return;
                }
                else {
                    if (category._id) {
                        payload.category = category._id;
                    }
                }
            }
            let image_thumbnail = '';
            let image_details = [];
            if (req.files) {
                const files = req.files;
                // saat update image_thumbnail harus berikan juga req.body.image_thumbnail yang lama                                
                if (files.image_thumbnail && files.image_thumbnail.length > 0) {
                    // ini new imagenya
                    fs_1.default.unlinkSync(path_1.default.resolve(__dirname, '../../' + `public/images${product.image_thumbnail}`));
                    const file = files.image_thumbnail[0];
                    const tmp_path = file.path;
                    const originalExt = file.originalname.split('.').pop();
                    const filename = file.filename + '.' + originalExt;
                    const target_path = path_1.default.resolve(__dirname, '../../' + `public/images/${filename}`);
                    const src = fs_1.default.createReadStream(tmp_path);
                    const dest = fs_1.default.createWriteStream(target_path);
                    src.pipe(dest);
                    image_thumbnail = `/${filename}`;
                    src.on('error', () => {
                        if (fs_1.default.existsSync(target_path)) {
                            fs_1.default.unlinkSync(target_path);
                        }
                        dest.end();
                        res.status(500).json({ message: 'Failed to updated image' });
                    });
                }
                // saat update image_detail harus berikan juga req.body.image_details[] yang lama                                
                if (req.body.image_details) {
                    if (req.body.image_details.length > 0) {
                        product.image_details.forEach((image_detail) => {
                            if (!req.body.image_details.includes(image_detail)) {
                                fs_1.default.unlinkSync(path_1.default.resolve(__dirname, '../../' + `public/images${image_detail}`));
                            }
                            else {
                                image_details.push(image_detail);
                            }
                        });
                    }
                    else {
                        product.image_details.forEach((image_detail) => {
                            fs_1.default.unlinkSync(path_1.default.resolve(__dirname, '../../' + `public/images${image_detail}`));
                        });
                    }
                }
                if (!req.body.image_details) {
                    product.image_details.forEach((image_detail) => {
                        fs_1.default.unlinkSync(path_1.default.resolve(__dirname, '../../' + `public/images${image_detail}`));
                    });
                }
                if (files.image_detail && files.image_detail.length > 0) {
                    files.image_detail.forEach((file) => {
                        const tmp_path = file.path;
                        const originalExt = file.originalname.split('.').pop();
                        const filename = file.filename + '.' + originalExt;
                        const target_path = path_1.default.resolve(__dirname, '../../' + `public/images/${filename}`);
                        const src = fs_1.default.createReadStream(tmp_path);
                        const dest = fs_1.default.createWriteStream(target_path);
                        src.pipe(dest);
                        image_details.push(`/${filename}`);
                        src.on('error', () => {
                            if (fs_1.default.existsSync(target_path)) {
                                fs_1.default.unlinkSync(target_path);
                            }
                            dest.end();
                            res.status(500).json({ message: 'Failed to updated image' });
                        });
                    });
                }
            }
            const updatedProduct = yield model_2.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, payload), { image_thumbnail: image_thumbnail.length > 0 ? image_thumbnail : product.image_thumbnail, image_details: image_details.length > 0 ? image_details : product.image_details }), { new: true, runValidators: true });
            res.status(200).json(updatedProduct);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield model_2.default.findById(req.params.id);
        if (product) {
            if (product.image_thumbnail) {
                const image_thumbnail = path_1.default.resolve(__dirname, '../../' + `public/images/${product.image_thumbnail}`);
                fs_1.default.unlinkSync(image_thumbnail);
            }
            if (product.image_details) {
                product.image_details.forEach((image_detail) => {
                    const image = path_1.default.resolve(__dirname, '../../' + `public/images/${image_detail}`);
                    fs_1.default.unlinkSync(image);
                });
            }
            yield model_2.default.findByIdAndDelete(req.params.id);
            res.status(204).json();
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
