"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    image_thumbnail: { type: String, required: true },
    image_details: [{ type: String, required: true }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Product', productSchema);
