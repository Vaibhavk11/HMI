import { WorkoutProgram, DayWorkout } from '../types/workout';
import { warmupExercises, cooldownExercises } from './warmupCooldownExercises';
import { mainExercises } from './mainExercises';

// Helper to find exercise by ID
const findExercise = (id: string) => {
  return mainExercises.find(ex => ex.id === id);
};

// Create strength day workout (Mon, Wed, Fri)
const createStrengthDay = (weekNum: number, dayNum: number, dayName: string): DayWorkout => ({
  id: `week-${weekNum}-day-${dayNum}`,
  dayName,
  dayNumber: dayNum,
  description: 'Full-body strength training',
  isRestDay: false,
  sections: [
    {
      type: 'warmup',
      title: 'Warm Up',
      exercises: warmupExercises
    },
    {
      type: 'main',
      title: 'Main Workout',
      exercises: [
        findExercise('exercise-free-squats')!,
        findExercise('exercise-single-leg-calf-raise')!,
        findExercise('exercise-inverted-rows')!,
        findExercise('exercise-push-ups')!,
        findExercise('exercise-prone-alternate-arm-leg-raise')!,
        findExercise('exercise-partial-crunches')!,
        findExercise('exercise-grip-and-hang')!
      ]
    },
    {
      type: 'cooldown',
      title: 'Cool Down',
      exercises: cooldownExercises
    }
  ]
});

// Create cardio day workout (Tue, Thu, Sat)
const createCardioDay = (weekNum: number, dayNum: number, dayName: string): DayWorkout => ({
  id: `week-${weekNum}-day-${dayNum}`,
  dayName,
  dayNumber: dayNum,
  description: 'Cardio day - Jogging',
  isRestDay: false,
  sections: [
    {
      type: 'warmup',
      title: 'Warm Up',
      exercises: warmupExercises
    },
    {
      type: 'main',
      title: 'Main Workout',
      exercises: [findExercise('exercise-jogging')!]
    },
    {
      type: 'cooldown',
      title: 'Cool Down',
      exercises: cooldownExercises
    }
  ]
});

// Create rest day (Sunday)
const createRestDay = (weekNum: number): DayWorkout => ({
  id: `week-${weekNum}-day-7`,
  dayName: 'Sunday',
  dayNumber: 7,
  description: 'Rest day - Allow your body to recover',
  isRestDay: true,
  sections: []
});

// Create the complete 12-week workout program
export const twelveWeekProgram: WorkoutProgram = {
  id: 'twelve-week-beginner',
  title: '12-Week Beginner Workout Program',
  description: 'A progressive 12-week workout program for beginners focusing on strength and cardio. Train 6 days per week with proper rest.',
  weeks: Array.from({ length: 12 }, (_, weekIndex) => {
    const weekNum = weekIndex + 1;
    return {
      weekNumber: weekNum,
      days: [
        createStrengthDay(weekNum, 1, 'Monday'),
        createCardioDay(weekNum, 2, 'Tuesday'),
        createStrengthDay(weekNum, 3, 'Wednesday'),
        createCardioDay(weekNum, 4, 'Thursday'),
        createStrengthDay(weekNum, 5, 'Friday'),
        createCardioDay(weekNum, 6, 'Saturday'),
        createRestDay(weekNum)
      ]
    };
  })
};

// Function to get workout by week and day
export const getWorkoutByWeekAndDay = (
  weekNumber: number, 
  dayNumber: number
): DayWorkout | null => {
  if (weekNumber < 1 || weekNumber > 12) return null;
  if (dayNumber < 1 || dayNumber > 7) return null;
  
  const week = twelveWeekProgram.weeks[weekNumber - 1];
  return week.days.find(day => day.dayNumber === dayNumber) || null;
};

// Function to get current week's workouts
export const getCurrentWeekWorkouts = (weekNumber: number): DayWorkout[] => {
  if (weekNumber < 1 || weekNumber > 12) return [];
  return twelveWeekProgram.weeks[weekNumber - 1].days;
};
