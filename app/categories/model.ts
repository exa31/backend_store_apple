import { model, Schema, Document } from 'mongoose';

export interface Category extends Document {
    name: string;
    _id: string | Schema.Types.ObjectId;
}

const categoriesSchema = new Schema<Category>({
    name: {
        type: String,
        required: true
    }
});

export default model<Category>('Category', categoriesSchema);