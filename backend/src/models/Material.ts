import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  type: 'presentation' | 'video' | 'chat_web';
  url: string; // For download or link
  videoUrl?: string; // Specific for video type (embed)
}

const MaterialSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['presentation', 'video', 'chat_web'] 
  },
  url: { type: String, required: false },
  videoUrl: { type: String, required: false }
});

export default mongoose.model<IMaterial>('Material', MaterialSchema);
