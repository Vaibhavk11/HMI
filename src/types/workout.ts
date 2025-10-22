// Workout-related types for the fitness tracking application

export type ExerciseMechanic = 'timed' | 'reps' | 'hold' | 'distance' | 'failure';
export type SectionType = 'warmup' | 'main' | 'cooldown';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  mechanic: ExerciseMechanic;
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  targetMuscles?: string[];
  defaultReps?: number;
  defaultSets?: number;
  defaultDuration?: number; // in seconds
  restBetweenSets?: number; // in seconds
  restAfterExercise?: number; // in seconds
}

export interface WorkoutSection {
  type: SectionType;
  title: string;
  exercises: Exercise[];
}

export interface DayWorkout {
  id: string;
  dayName: string;
  dayNumber: number; // 1 (Monday) through 7 (Sunday)
  description?: string;
  sections: WorkoutSection[];
  isRestDay: boolean;
}

export interface WeekProgram {
  weekNumber: number;
  days: DayWorkout[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  weeks: WeekProgram[];
}

// For tracking user progress
export interface ExerciseCompletion {
  exerciseId: string;
  mechanic?: ExerciseMechanic; // Store mechanic type for proper display
  sets: {
    reps?: number;
    duration?: number;
    completed: boolean;
  }[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  programId: string;
  weekNumber: number;
  dayNumber: number;
  date: Date;
  startTime: Date;
  endTime?: Date; // Optional to handle old logs without endTime
  completed: boolean;
  sections: {
    type: SectionType;
    exercises: ExerciseCompletion[];
  }[];
  notes?: string;
  rating?: number;
}

export interface UserProgress {
  currentWeek: number;
  currentDay: number;
  startDate: Date;
  completedWorkouts: string[]; // WorkoutLog IDs
  streak: number;
  longestStreak: number;
}
