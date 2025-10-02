import { Exercise } from '../exercise.entity';

export interface ExerciseItem {
  sets: number;
  reps: number[];
  exercise: Exercise;
  order: number;
}
