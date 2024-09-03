"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    products: [
        {
            _id: false,
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Cart', cartSchema);
