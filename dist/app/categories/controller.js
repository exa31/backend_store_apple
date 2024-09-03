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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getCategories = void 0;
const model_1 = __importDefault(require("./model"));
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield model_1.default.find();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCategories = getCategories;
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield model_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCategory = getCategory;
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const category = new model_1.default({ name });
        const newCategory = yield category.save();
        res.status(201).json(newCategory);
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const id = req.params.id;
        const category = yield model_1.default.findById(id);
        if (category) {
            category.name = name;
            const updatedCategory = yield category.save();
            res.status(200).json(updatedCategory);
        }
        else {
            res.status(404).json({ message: 'Category not found' });
        }
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const category = yield model_1.default.findById(id);
        if (category) {
            yield model_1.default.deleteOne({ _id: id });
            res.status(200).json({ message: 'Category deleted' });
        }
        else {
            res.status(404).json({ message: 'Category not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteCategory = deleteCategory;
