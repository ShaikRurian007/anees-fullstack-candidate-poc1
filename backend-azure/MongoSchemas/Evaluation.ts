import { Schema } from 'mongoose';
export const EvaluationSchema = new Schema({
  candidateId: { type: String, index: true },
  scored: { type: Schema.Types.Mixed },
}, { timestamps: true });
