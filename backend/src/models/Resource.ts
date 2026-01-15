import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  imageUrl: string; // Changed from 'type' to 'imageUrl'
  url: string;
  createdAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Changed from 'type' to 'imageUrl'
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResource>('Resource', ResourceSchema);
