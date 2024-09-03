import { model, Schema, Document, Types } from "mongoose";




export interface User extends Document {
    name: string;
    _id: Types.ObjectId | string;
    email: string;
    password: string;
    role: string;
    token?: string[];
    likes?: string[];
    createdAt: Date;
    cart: Types.ObjectId | string
    updatedAt: Date;
}

// Remove the line that references 'THydratedDocumentType'


const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    token: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
}, { timestamps: true });

export default model<User>('User', userSchema);
