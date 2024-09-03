import { Schema, Types, model } from "mongoose";

export interface DeliveryAddress {
    _id?: string;
    provinsi: string;
    kabupaten: string;
    user: Types.ObjectId | string;
    kecamatan: string;
    kelurahan: string;
    name: string;
    detail: string;
    createdAt: Date;
    updatedAt: Date;
}

const deliveryAddressSchema = new Schema<DeliveryAddress>({
    provinsi: { type: String, required: true },
    kabupaten: { type: String, required: true },
    name: { type: String, required: true },
    kecamatan: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    kelurahan: { type: String, required: true },
    detail: { type: String, required: true }
}, { timestamps: true });

export default model<DeliveryAddress>('DeliveryAddress', deliveryAddressSchema);
