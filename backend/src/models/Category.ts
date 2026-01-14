import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  description: string;
  image: string;
  link: string;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICategory>('Category', CategorySchema);
