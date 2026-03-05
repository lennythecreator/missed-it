import mongoose, { Schema, Document } from 'mongoose';

export interface IMissedGoal extends Document {
  user: string;
  points: number;
  date: Date;
  link?: string;
}

const MissedGoalSchema: Schema = new Schema({
  user: { type: String, required: true },
  points: { type: Number, required: true, default: 1 },
  date: { type: Date, required: true, default: Date.now },
  link: { type: String },
});

export default mongoose.models.MissedGoal || mongoose.model<IMissedGoal>('MissedGoal', MissedGoalSchema);
