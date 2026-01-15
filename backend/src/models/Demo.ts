import mongoose, { Schema, Document } from 'mongoose';

export interface IDemo extends Document {
  title: string;
  url: string; 
  downloadUrl: string; 
  industryId: mongoose.Types.ObjectId;
}

const DemoSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  downloadUrl: { type: String, required: false },
  industryId: { type: Schema.Types.ObjectId, ref: 'Industry', required: true }
});

export default mongoose.model<IDemo>('Demo', DemoSchema);
