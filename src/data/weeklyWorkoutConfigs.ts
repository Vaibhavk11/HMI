import { Exercise } from '../types/workout';
import { mainExercises } from './mainExercises';

// Helper to find and clone exercise with custom sets/reps
const getExercise = (id: string, overrides?: Partial<Exercise>): Exercise => {
  const exercise = mainExercises.find(ex => ex.id === id);
  if (!exercise) throw new Error(`Exercise ${id} not found`);
  return { ...exercise, ...overrides };
};

// Week 1 Configuration (Base/Current)
export const week1Strength = [
  getExercise('exercise-free-squats', { defaultReps: 15, defaultSets: 2 }),
  getExercise('exercise-single-leg-calf-raise', { defaultReps: 12, defaultSets: 1 }),
  getExercise('exercise-inverted-rows', { defaultReps: 8, defaultSets: 2 }),
  getExercise('exercise-push-ups', { defaultReps: 8, defaultSets: 2 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-partial-crunches', { defaultReps: 8, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang', { defaultSets: 1 })
];

export const week1Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 720 }) // 12 minutes
];

// Week 2 Configuration
export const week2Strength = [
  getExercise('exercise-free-squats', { defaultReps: 15, defaultSets: 3 }),
  getExercise('exercise-single-leg-calf-raise', { defaultReps: 15, defaultSets: 1 }),
  getExercise('exercise-inverted-rows', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-push-ups', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-partial-crunches', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang', { defaultSets: 2 })
];

export const week2Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 720 }) // 12 minutes
];

// Week 3 Configuration
export const week3Strength = [
  getExercise('exercise-free-squats', { defaultReps: 15, defaultSets: 3 }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 15, defaultSets: 1 }),
  getExercise('exercise-inverted-rows', { defaultReps: 8, defaultSets: 3 }),
  getExercise('exercise-push-ups', { defaultReps: 8, defaultSets: 3 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-partial-crunches', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang', { defaultSets: 2 })
];

export const week3Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 900 }) // 15 minutes
];

// Week 4 Configuration (Introducing weighted exercises)
export const week4Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 2,
    description: 'Start with 5kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 15, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '5kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '5kgs added weight'
  }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 2,
    description: '5kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 1 })
];

export const week4Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 900 }) // 15 minutes
];

// Week 5 Configuration
export const week5Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 2,
    description: '7.5kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 15, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '7.5kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '7.5kgs added weight'
  }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-superman-hold', { defaultSets: 1 }),
  getExercise('exercise-full-crunches', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 2,
    description: '7.5kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 2 })
];

export const week5Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 1020 }) // 17 minutes
];

// Week 6 Configuration
export const week6Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 3,
    description: '7.5kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '7.5kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '7.5kgs added weight'
  }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 15, defaultSets: 2 }),
  getExercise('exercise-superman-hold', { defaultSets: 1 }),
  getExercise('exercise-full-crunches', { defaultReps: 15, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '7.5kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 2 })
];

export const week6Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 1020 }) // 17 minutes
];

// Week 7 Configuration (Introducing chin-ups and dips)
export const week7Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 2,
    description: '10kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 10, defaultSets: 2 }),
  getExercise('exercise-wide-grip-chin-up', { defaultReps: 5, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 8, 
    defaultSets: 2,
    description: '10kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '10kgs added weight'
  }),
  getExercise('exercise-parallel-bar-dip', { defaultReps: 5, defaultSets: 1 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 15, defaultSets: 2 }),
  getExercise('exercise-superman-hold', { defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 15, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '10kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 2 })
];

export const week7Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 1200 }) // 20 minutes
];

// Week 8 Configuration
export const week8Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 3,
    description: '10kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-wide-grip-chin-up', { defaultReps: 5, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '10kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '10kgs added weight'
  }),
  getExercise('exercise-parallel-bar-dip', { defaultReps: 5, defaultSets: 1 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-superman-hold', { defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 15, defaultSets: 2 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '10kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 3 })
];

export const week8Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 1200 }) // 20 minutes
];

// Week 9 Configuration
export const week9Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 2,
    description: '12.5kgs / 15kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-wide-grip-chin-up', { defaultReps: 7, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '12.5kgs / 15kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '12.5kgs / 15kgs added weight'
  }),
  getExercise('exercise-parallel-bar-dip', { defaultReps: 7, defaultSets: 1 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-superman-hold', { defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '12.5kgs / 15kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 3 })
];

export const week9Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 1500 }) // 25 minutes
];

// Week 10 Configuration
export const week10Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 3,
    description: '12.5kgs / 15kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 12, defaultSets: 2 }),
  getExercise('exercise-wide-grip-chin-up', { defaultReps: 7, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '12.5kgs / 15kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '12.5kgs / 15kgs added weight'
  }),
  getExercise('exercise-parallel-bar-dip', { defaultReps: 7, defaultSets: 1 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-superman-hold', { defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '12.5kgs / 15kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 3 })
];

export const week10Cardio = [
  getExercise('exercise-jogging', { defaultDuration: 1500 }) // 25 minutes
];

// Week 11 Configuration
export const week11Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 2,
    description: '15kgs / 17.5kgs / 20kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 12, defaultSets: 3 }),
  getExercise('exercise-wide-grip-chin-up', { defaultReps: 10, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '15kgs / 17.5kgs / 20kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 2,
    description: '15kgs / 17.5kgs / 20kgs added weight'
  }),
  getExercise('exercise-parallel-bar-dip', { defaultReps: 10, defaultSets: 1 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-superman-hold', { defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 12, defaultSets: 3 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '15kgs / 17.5kgs / 20kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 3 })
];

export const week11Cardio = [
  getExercise('exercise-jogging', { 
    defaultDuration: 1800, // 30 minutes
    description: 'If you can jog for longer (safely) then please go ahead'
  })
];

// Week 12 Configuration (Peak week)
export const week12Strength = [
  getExercise('exercise-goblet-squats', { 
    defaultReps: 15, 
    defaultSets: 3,
    description: '15kgs / 17.5kgs / 20kgs weight'
  }),
  getExercise('exercise-standing-calf-raise', { defaultReps: 12, defaultSets: 3 }),
  getExercise('exercise-wide-grip-chin-up', { defaultReps: 12, defaultSets: 1 }),
  getExercise('exercise-inverted-rows-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '15kgs / 17.5kgs / 20kgs added weight'
  }),
  getExercise('exercise-push-ups-weighted', { 
    defaultReps: 10, 
    defaultSets: 3,
    description: '15kgs / 17.5kgs / 20kgs added weight'
  }),
  getExercise('exercise-parallel-bar-dip', { defaultReps: 12, defaultSets: 1 }),
  getExercise('exercise-prone-alternate-arm-leg-raise', { defaultReps: 10, defaultSets: 3 }),
  getExercise('exercise-superman-hold', { defaultSets: 2 }),
  getExercise('exercise-full-crunches', { defaultReps: 12, defaultSets: 3 }),
  getExercise('exercise-grip-and-hang-weighted', { 
    defaultSets: 3,
    description: '15kgs / 17.5kgs / 20kgs added weight'
  }),
  getExercise('exercise-pinch-holds', { defaultSets: 3 })
];

export const week12Cardio = [
  getExercise('exercise-jogging', { 
    defaultDuration: 1800, // 30 minutes
    description: 'If you can jog for longer (safely) then please go ahead'
  })
];

// Export weekly configs as a map
export const weeklyWorkoutConfigs = new Map<number, { strength: Exercise[], cardio: Exercise[] }>([
  [1, { strength: week1Strength, cardio: week1Cardio }],
  [2, { strength: week2Strength, cardio: week2Cardio }],
  [3, { strength: week3Strength, cardio: week3Cardio }],
  [4, { strength: week4Strength, cardio: week4Cardio }],
  [5, { strength: week5Strength, cardio: week5Cardio }],
  [6, { strength: week6Strength, cardio: week6Cardio }],
  [7, { strength: week7Strength, cardio: week7Cardio }],
  [8, { strength: week8Strength, cardio: week8Cardio }],
  [9, { strength: week9Strength, cardio: week9Cardio }],
  [10, { strength: week10Strength, cardio: week10Cardio }],
  [11, { strength: week11Strength, cardio: week11Cardio }],
  [12, { strength: week12Strength, cardio: week12Cardio }]
]);
