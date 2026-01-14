import mongoose, { Schema, Document } from 'mongoose';

export interface IIndustry extends Document {
  name: string;
}

const IndustrySchema: Schema = new Schema({
  name: { type: String, required: true }
});

export default mongoose.model<IIndustry>('Industry', IndustrySchema);
