import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  type: string;
  url: string;
  createdAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, 
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
