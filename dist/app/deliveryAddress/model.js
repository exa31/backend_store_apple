"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deliveryAddressSchema = new mongoose_1.Schema({
    provinsi: { type: String, required: true },
    kabupaten: { type: String, required: true },
    name: { type: String, required: true },
    kecamatan: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    kelurahan: { type: String, required: true },
    detail: { type: String, required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('DeliveryAddress', deliveryAddressSchema);
