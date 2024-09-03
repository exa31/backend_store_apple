"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Remove the line that references 'THydratedDocumentType'
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    token: [{ type: String }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' }],
    cart: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cart' },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
