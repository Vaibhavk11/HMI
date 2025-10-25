import { Exercise } from '../types/workout';
import { exerciseImageMap } from './exerciseImages';

export const mainExercises: Exercise[] = [
  {
    id: 'exercise-free-squats',
    name: 'Free Squats',
    description: 'Basic squat movement targeting lower body muscles',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-free-squats'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and back straight',
      'Lower your body by bending knees as if sitting in a chair',
      'Go as low as comfortable, ideally thighs parallel to floor',
      'Push through heels to return to standing'
    ],
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
    imageUrl: exerciseImageMap['exercise-single-leg-calf-raise'],
    instructions: [
      'Stand on one leg, holding something for balance if needed',
      'Raise up onto the ball of your foot as high as possible',
      'Lower down with control',
      'Complete all reps on one side before switching'
    ],
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
    imageUrl: exerciseImageMap['exercise-inverted-rows'],
    instructions: [
      'Position yourself under a sturdy horizontal bar',
      'Grip bar with hands slightly wider than shoulder-width',
      'Keep body straight, heels on ground',
      'Pull chest up towards the bar',
      'Lower with control'
    ],
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
    imageUrl: exerciseImageMap['exercise-push-ups'],
    instructions: [
      'Start in high plank with hands slightly wider than shoulders',
      'Keep body in straight line from head to heels',
      'Lower chest to ground by bending elbows',
      'Push back up to starting position',
      'Keep core engaged throughout'
    ],
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
    imageUrl: exerciseImageMap['exercise-regressed-push-ups'],
    instructions: [
      'Start on hands and knees with hands shoulder-width apart',
      'Keep body straight from head to knees',
      'Lower chest to ground by bending elbows',
      'Push back up to starting position',
      'Alternative: Do push-ups against a wall'
    ],
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
    imageUrl: exerciseImageMap['exercise-prone-alternate-arm-leg-raise'],
    instructions: [
      'Lie face down with arms extended overhead',
      'Simultaneously raise opposite arm and leg off ground',
      'Hold briefly at the top',
      'Lower with control',
      'Repeat with other arm and leg',
      'Count each side as one rep'
    ],
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
    imageUrl: exerciseImageMap['exercise-partial-crunches'],
    instructions: [
      'Lie on back with knees bent, feet flat on floor',
      'Place hands behind head or across chest',
      'Engage core and lift shoulders off ground',
      'Do not pull on neck',
      'Lower back down with control'
    ],
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
    imageUrl: exerciseImageMap['exercise-grip-and-hang'],
    instructions: [
      'Find sturdy horizontal bar where feet don\'t touch ground',
      'Grip bar with both hands shoulder-width apart',
      'Hang with arms fully extended',
      'Keep shoulders engaged (don\'t let them shrug up)',
      'Hold for as long as possible until failure'
    ],
    defaultSets: 1,
    targetMuscles: ['forearms', 'grip', 'shoulders', 'back', 'core']
  },
  {
    id: 'exercise-jogging',
    name: 'Jogging',
    description: 'Cardiovascular exercise at steady pace',
    mechanic: 'timed',
    imageUrl: exerciseImageMap['exercise-jogging'],
    instructions: [
      'Find a flat surface or track',
      'Start at a comfortable pace you can maintain',
      'Focus on consistent breathing rhythm',
      'Maintain same pace throughout duration',
      'Try to jog continuously from start to finish',
      'Increase performance with each session'
    ],
    defaultDuration: 720, // 12 minutes
    defaultSets: 1,
    targetMuscles: ['cardiovascular', 'legs', 'endurance']
  },
  // New exercises for progressive weeks
  {
    id: 'exercise-standing-calf-raise',
    name: 'Standing Calf Raise',
    description: 'Calf exercise using both legs',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-standing-calf-raise'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Can hold onto wall or stable surface for balance',
      'Raise up onto balls of both feet as high as possible',
      'Hold briefly at the top',
      'Lower down with control',
      'Can add weight by holding dumbbells'
    ],
    defaultReps: 15,
    defaultSets: 1,
    restAfterExercise: 30,
    targetMuscles: ['calves', 'gastrocnemius', 'soleus']
  },
  {
    id: 'exercise-goblet-squats',
    name: 'Back / Goblet Squats with Weight',
    description: 'Squats with added weight for progression',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-goblet-squats'],
    instructions: [
      'Hold weight at chest level (goblet) or across shoulders (back squat)',
      'Stand with feet shoulder-width apart',
      'Keep chest up and core engaged',
      'Lower into squat position',
      'Push through heels to stand',
      'Start with 5kg and progress to 20kg over weeks'
    ],
    defaultReps: 15,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'core']
  },
  {
    id: 'exercise-inverted-rows-weighted',
    name: 'Inverted Rows with Weight',
    description: 'Inverted rows with added resistance',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-inverted-rows-weighted'],
    instructions: [
      'Position yourself under a sturdy horizontal bar',
      'Wear a weighted vest or backpack with weight',
      'Grip bar with hands slightly wider than shoulder-width',
      'Keep body straight, heels on ground',
      'Pull chest up towards the bar',
      'Lower with control'
    ],
    defaultReps: 10,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['upper back', 'lats', 'biceps', 'forearms']
  },
  {
    id: 'exercise-push-ups-weighted',
    name: 'Push Ups with Weight',
    description: 'Push-ups with added resistance',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-push-ups-weighted'],
    instructions: [
      'Start in high plank with hands slightly wider than shoulders',
      'Place weight plate on back or wear weighted vest',
      'Keep body in straight line from head to heels',
      'Lower chest to ground by bending elbows',
      'Push back up to starting position',
      'Keep core engaged throughout'
    ],
    defaultReps: 10,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['chest', 'shoulders', 'triceps', 'core']
  },
  {
    id: 'exercise-full-crunches',
    name: 'Full Crunches',
    description: 'Complete crunch movement with full range',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-full-crunches'],
    instructions: [
      'Lie on back with knees bent, feet flat on floor',
      'Place hands behind head',
      'Engage core and lift upper body completely off ground',
      'Bring chest towards knees',
      'Do not pull on neck',
      'Lower back down with control'
    ],
    defaultReps: 10,
    defaultSets: 2,
    restBetweenSets: 60,
    targetMuscles: ['abdominals', 'core', 'hip flexors']
  },
  {
    id: 'exercise-grip-and-hang-weighted',
    name: 'Grip and Hang with Weight',
    description: 'Hanging exercise with added weight',
    mechanic: 'failure',
    imageUrl: exerciseImageMap['exercise-grip-and-hang-weighted'],
    instructions: [
      'Find sturdy horizontal bar where feet don\'t touch ground',
      'Wear weighted vest or hold dumbbell between feet',
      'Grip bar with both hands shoulder-width apart',
      'Hang with arms fully extended',
      'Keep shoulders engaged',
      'Hold for as long as possible until failure'
    ],
    defaultSets: 2,
    targetMuscles: ['forearms', 'grip', 'shoulders', 'back', 'core']
  },
  {
    id: 'exercise-pinch-holds',
    name: 'Pinch Holds',
    description: 'Grip strength exercise using pinch grip',
    mechanic: 'failure',
    imageUrl: exerciseImageMap['exercise-pinch-holds'],
    instructions: [
      'Take two weight plates or thick books',
      'Pinch them together with thumb on one side, fingers on other',
      'Lift and hold at your side',
      'Keep arm straight',
      'Hold until grip fails',
      'Alternate hands between sets'
    ],
    defaultSets: 1,
    targetMuscles: ['grip', 'forearms', 'thumb']
  },
  {
    id: 'exercise-superman-hold',
    name: 'Superman Hold',
    description: 'Isometric back extension hold',
    mechanic: 'failure',
    imageUrl: exerciseImageMap['exercise-superman-hold'],
    instructions: [
      'Lie face down with arms extended overhead',
      'Simultaneously raise arms, chest, and legs off ground',
      'Hold this "flying" position',
      'Keep looking down to protect neck',
      'Hold until you cannot maintain form',
      'Lower down and rest'
    ],
    defaultSets: 1,
    targetMuscles: ['lower back', 'glutes', 'hamstrings', 'upper back', 'core']
  },
  {
    id: 'exercise-wide-grip-chin-up',
    name: 'Wide Grip Chin Up',
    description: 'Pull-up with wide overhand grip',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-wide-grip-chin-up'],
    instructions: [
      'Grip pull-up bar with hands wider than shoulders',
      'Use overhand (pronated) grip',
      'Hang with arms fully extended',
      'Pull yourself up until chin is over bar',
      'Lower with control to full extension',
      'Can use assistance bands if needed'
    ],
    defaultReps: 5,
    defaultSets: 1,
    restAfterExercise: 60,
    targetMuscles: ['lats', 'upper back', 'biceps', 'core']
  },
  {
    id: 'exercise-parallel-bar-dip',
    name: 'Parallel Bar Dip',
    description: 'Dipping exercise for chest and triceps',
    mechanic: 'reps',
    imageUrl: exerciseImageMap['exercise-parallel-bar-dip'],
    instructions: [
      'Grip parallel bars and lift yourself up',
      'Start with arms straight, body vertical',
      'Lower body by bending elbows to 90 degrees',
      'Lean slightly forward to engage chest',
      'Push back up to starting position',
      'Can use assistance bands if needed'
    ],
    defaultReps: 5,
    defaultSets: 1,
    restAfterExercise: 60,
    targetMuscles: ['chest', 'triceps', 'shoulders', 'core']
  }
];
