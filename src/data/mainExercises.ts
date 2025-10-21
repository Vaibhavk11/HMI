import { Exercise } from '../types/workout';

export const mainExercises: Exercise[] = [
  {
    id: 'exercise-free-squats',
    name: 'Free Squats',
    description: 'Basic squat movement targeting lower body muscles',
    mechanic: 'reps',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and back straight',
      'Lower your body by bending knees as if sitting in a chair',
      'Go as low as comfortable, ideally thighs parallel to floor',
      'Push through heels to return to standing'
    ],
    imageUrl: '/exercises/free-squats.jpg',
    defaultReps: 15,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['quadriceps', 'hamstrings', 'glutes']
  },
  {
    id: 'exercise-single-leg-calf-raise',
    name: 'Single Leg Standing Calf Raise',
    description: 'Calf exercise using one leg at a time',
    mechanic: 'reps',
    instructions: [
      'Stand on one leg, holding something for balance if needed',
      'Raise up onto the ball of your foot as high as possible',
      'Lower down with control',
      'Complete all reps on one side before switching'
    ],
    imageUrl: '/exercises/single-leg-calf-raise.jpg',
    defaultReps: 12,
    defaultSets: 1,
    restAfterExercise: 30,
    targetMuscles: ['calves', 'gastrocnemius', 'soleus']
  },
  {
    id: 'exercise-inverted-rows',
    name: 'Inverted Rows',
    description: 'Pulling exercise targeting upper back muscles',
    mechanic: 'reps',
    instructions: [
      'Position yourself under a sturdy horizontal bar',
      'Grip bar with hands slightly wider than shoulder-width',
      'Keep body straight, heels on ground',
      'Pull chest up towards the bar',
      'Lower with control'
    ],
    imageUrl: '/exercises/inverted-rows.jpg',
    defaultReps: 8,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['upper back', 'lats', 'biceps', 'forearms']
  },
  {
    id: 'exercise-push-ups',
    name: 'Push Ups',
    description: 'Classic pushing exercise for chest, shoulders, and triceps',
    mechanic: 'reps',
    instructions: [
      'Start in high plank with hands slightly wider than shoulders',
      'Keep body in straight line from head to heels',
      'Lower chest to ground by bending elbows',
      'Push back up to starting position',
      'Keep core engaged throughout'
    ],
    imageUrl: '/exercises/push-ups.jpg',
    defaultReps: 8,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['chest', 'shoulders', 'triceps', 'core']
  },
  {
    id: 'exercise-regressed-push-ups',
    name: 'Regressed Push Ups',
    description: 'Modified push-up for beginners (knee or wall)',
    mechanic: 'reps',
    instructions: [
      'Start on hands and knees with hands shoulder-width apart',
      'Keep body straight from head to knees',
      'Lower chest to ground by bending elbows',
      'Push back up to starting position',
      'Alternative: Do push-ups against a wall'
    ],
    imageUrl: '/exercises/regressed-push-ups.jpg',
    defaultReps: 8,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['chest', 'shoulders', 'triceps']
  },
  {
    id: 'exercise-prone-alternate-arm-leg-raise',
    name: 'Prone Alternate Arm and Leg Raise',
    description: 'Core exercise engaging lower back and glutes',
    mechanic: 'reps',
    instructions: [
      'Lie face down with arms extended overhead',
      'Simultaneously raise opposite arm and leg off ground',
      'Hold briefly at the top',
      'Lower with control',
      'Repeat with other arm and leg',
      'Count each side as one rep'
    ],
    imageUrl: '/exercises/prone-alternate-arm-leg-raise.jpg',
    defaultReps: 10,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['lower back', 'glutes', 'core', 'shoulders']
  },
  {
    id: 'exercise-partial-crunches',
    name: 'Partial Crunches',
    description: 'Core exercise targeting abdominal muscles',
    mechanic: 'reps',
    instructions: [
      'Lie on back with knees bent, feet flat on floor',
      'Place hands behind head or across chest',
      'Engage core and lift shoulders off ground',
      'Do not pull on neck',
      'Lower back down with control'
    ],
    imageUrl: '/exercises/partial-crunches.jpg',
    defaultReps: 8,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['abdominals', 'core']
  },
  {
    id: 'exercise-grip-and-hang',
    name: 'Grip and Hang',
    description: 'Hanging exercise building grip strength',
    mechanic: 'failure',
    instructions: [
      'Find sturdy horizontal bar where feet don\'t touch ground',
      'Grip bar with both hands shoulder-width apart',
      'Hang with arms fully extended',
      'Keep shoulders engaged (don\'t let them shrug up)',
      'Hold for as long as possible until failure'
    ],
    imageUrl: '/exercises/grip-and-hang.jpg',
    defaultSets: 1,
    targetMuscles: ['forearms', 'grip', 'shoulders', 'back', 'core']
  },
  {
    id: 'exercise-jogging',
    name: 'Jogging',
    description: 'Cardiovascular exercise at steady pace',
    mechanic: 'timed',
    instructions: [
      'Find a flat surface or track',
      'Start at a comfortable pace you can maintain',
      'Focus on consistent breathing rhythm',
      'Maintain same pace throughout duration',
      'Try to jog continuously from start to finish',
      'Increase performance with each session'
    ],
    imageUrl: '/exercises/jogging.jpg',
    defaultDuration: 720, // 12 minutes
    defaultSets: 1,
    targetMuscles: ['cardiovascular', 'legs', 'endurance']
  }
];
