import mongoose, { Schema, Document } from 'mongoose';

export interface ICapsule extends Document {
  title: string;
  videoUrl: string;
  downloadUrl: string;
  description: string;
}

const CapsuleSchema: Schema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  downloadUrl: { type: String, required: false },
  description: { type: String, required: false }
});

export default mongoose.model<ICapsule>('Capsule', CapsuleSchema);
