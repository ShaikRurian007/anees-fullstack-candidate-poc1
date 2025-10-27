import { Schema } from 'mongoose';
export const ReportSchema = new Schema({
  candidateId: { type: String, index: true },
  candidate: { type: Schema.Types.Mixed },
  scored: { type: Schema.Types.Mixed },
  feedback: { type: Schema.Types.Mixed },
}, { timestamps: true });
