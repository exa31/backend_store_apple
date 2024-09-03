import { model, Schema, Document, Types } from "mongoose";

export interface Product extends Document {
    name: string;
    price: number;
    category: Schema.Types.ObjectId | string;
    description: string;
    image_thumbnail: string;
    image_details: string[];
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;
}

const productSchema = new Schema<Product>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    image_thumbnail: { type: String, required: true },
    image_details: [{ type: String, required: true }],
}, { timestamps: true });

export default model<Product>('Product', productSchema);