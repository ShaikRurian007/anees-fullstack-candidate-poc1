import { Schema } from 'mongoose';
export const CandidateSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  experience: { type: Number, required: true },
  skills: { type: [String], default: [] },
}, { timestamps: true });
