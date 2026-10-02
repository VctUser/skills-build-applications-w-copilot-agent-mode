import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    activityType: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    durationMinutes: { type: Number, min: 1 },
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema);