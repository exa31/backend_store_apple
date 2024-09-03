import { Schema, Types, model, Document } from "mongoose";
import { Product } from "../products/model";

export interface CartItems {
    product: string | Types.ObjectId | Product;
    quantity: number;
}

export interface Cart extends Document {
    _id: Types.ObjectId | string;
    products: CartItems[];
    user: Types.ObjectId | string;
}


const cartSchema = new Schema<Cart>({
    products: [
        {
            _id: false,
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default model<Cart>('Cart', cartSchema);
