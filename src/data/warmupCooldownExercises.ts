import { Exercise } from '../types/workout';

export const warmupExercises: Exercise[] = [
  {
    id: 'warmup-neck-rotations',
    name: 'Neck Rotations',
    description: 'Flexion and Extension / Lateral Flexion / Rotation',
    mechanic: 'reps',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Slowly rotate your head in a circular motion',
      'Do 5 rotations clockwise, then 5 counter-clockwise',
      'Include flexion/extension and lateral flexion movements',
      'Keep movements smooth and controlled'
    ],
    defaultReps: 10,
    defaultSets: 1,
    targetMuscles: ['neck', 'trapezius']
  },
  {
    id: 'warmup-arm-swings',
    name: 'Arm Swings',
    description: 'Dynamic shoulder and chest warm-up',
    mechanic: 'reps',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Swing both arms forward and backward in a controlled manner',
      'Keep the motion smooth and rhythmic',
      'Gradually increase range of motion'
    ],
    defaultReps: 15,
    defaultSets: 1,
    targetMuscles: ['shoulders', 'chest']
  },
  {
    id: 'warmup-shoulder-circumduction',
    name: 'Shoulder Circumduction',
    description: 'Circular shoulder movements to warm up shoulder joints',
    mechanic: 'reps',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Make large circles with your shoulders',
      'Do 10 circles forward, then 10 circles backward',
      'Keep the movement smooth and controlled'
    ],
    defaultReps: 20,
    defaultSets: 1,
    targetMuscles: ['shoulders', 'upper back']
  },
  {
    id: 'warmup-dynamic-chest-stretch',
    name: 'Dynamic Chest Stretch',
    description: 'Opening up the chest and shoulders',
    mechanic: 'reps',
    instructions: [
      'Stand with arms extended to sides at shoulder height',
      'Bring arms forward, crossing them in front',
      'Open arms back to starting position',
      'Repeat in a controlled, rhythmic manner'
    ],
    defaultReps: 15,
    defaultSets: 1,
    targetMuscles: ['chest', 'shoulders']
  },
  {
    id: 'warmup-side-bends',
    name: 'Side Bends',
    description: 'Lateral flexion to warm up the core and obliques',
    mechanic: 'reps',
    instructions: [
      'Stand with feet shoulder-width apart, hands on hips',
      'Bend to one side, keeping hips stable',
      'Return to center and bend to the other side',
      'Keep movements controlled and avoid leaning forward or backward'
    ],
    defaultReps: 20,
    defaultSets: 1,
    targetMuscles: ['obliques', 'core']
  },
  {
    id: 'warmup-windmill',
    name: 'Windmill',
    description: 'Full body rotation exercise',
    mechanic: 'reps',
    instructions: [
      'Stand with feet wider than shoulder-width apart',
      'Extend arms to sides at shoulder height',
      'Rotate torso and touch opposite hand to opposite foot',
      'Alternate sides in a controlled manner'
    ],
    defaultReps: 20,
    defaultSets: 1,
    targetMuscles: ['core', 'hamstrings', 'shoulders']
  },
  {
    id: 'warmup-cat-camel',
    name: 'Cat and Camel Drill',
    description: 'Spinal mobility exercise',
    mechanic: 'reps',
    instructions: [
      'Start on hands and knees in a quadruped position',
      'Arch your back up (cat position)',
      'Then drop your belly and lift your head (camel position)',
      'Move slowly between positions with control'
    ],
    defaultReps: 15,
    defaultSets: 1,
    targetMuscles: ['spine', 'core']
  },
  {
    id: 'warmup-hip-flexion-rotation',
    name: 'Standing Hip Flexion and Rotation',
    description: 'Hip mobility exercise',
    mechanic: 'reps',
    instructions: [
      'Stand on one leg for balance',
      'Lift the other knee up and rotate the hip',
      'Make controlled circular movements',
      'Switch legs after completing reps'
    ],
    defaultReps: 10,
    defaultSets: 1,
    targetMuscles: ['hips', 'hip flexors']
  },
  {
    id: 'warmup-leg-swings-front-back',
    name: 'Leg Swings (Front and Back)',
    description: 'Dynamic leg swings for hip mobility',
    mechanic: 'reps',
    instructions: [
      'Hold onto a wall or stable surface for balance',
      'Swing one leg forward and backward',
      'Keep the movement controlled',
      'Complete reps then switch legs'
    ],
    defaultReps: 15,
    defaultSets: 1,
    targetMuscles: ['hip flexors', 'hamstrings']
  },
  {
    id: 'warmup-leg-swings-side',
    name: 'Leg Swings (Side Swings)',
    description: 'Lateral leg swings for hip abduction',
    mechanic: 'reps',
    instructions: [
      'Hold onto a wall or stable surface for balance',
      'Swing one leg side to side across your body',
      'Keep the movement controlled',
      'Complete reps then switch legs'
    ],
    defaultReps: 15,
    defaultSets: 1,
    targetMuscles: ['hip abductors', 'hip adductors']
  },
  {
    id: 'warmup-spider-lunges',
    name: 'Spider Lunges',
    description: 'Dynamic lunge variation for hip mobility',
    mechanic: 'reps',
    instructions: [
      'Start in a high plank position',
      'Bring one foot forward outside your hand',
      'Hold briefly, feeling the stretch in your hip',
      'Return to plank and alternate sides'
    ],
    defaultReps: 10,
    defaultSets: 1,
    targetMuscles: ['hip flexors', 'groin', 'core']
  },
  {
    id: 'warmup-high-knees',
    name: 'High Knees (Running in Place)',
    description: 'Cardiovascular warm-up exercise',
    mechanic: 'timed',
    instructions: [
      'Stand with feet hip-width apart',
      'Run in place, bringing knees up high',
      'Pump arms in a running motion',
      'Maintain a quick, steady pace'
    ],
    defaultDuration: 90, // 1.5 minutes
    defaultSets: 1,
    targetMuscles: ['quadriceps', 'hip flexors', 'cardiovascular']
  }
];

export const cooldownExercises: Exercise[] = [
  {
    id: 'cooldown-seated-forward-bend',
    name: 'Paschimottanasana (Seated Forward Bend)',
    description: 'Deep hamstring and lower back stretch',
    mechanic: 'hold',
    instructions: [
      'Sit on the floor with legs extended in front',
      'Inhale and lengthen your spine',
      'Exhale and hinge at the hips to fold forward',
      'Hold the position and breathe deeply',
      'Try to relax into the stretch, do not force'
    ],
    defaultDuration: 30, // 30 seconds
    defaultSets: 2,
    targetMuscles: ['hamstrings', 'lower back', 'calves']
  },
  {
    id: 'cooldown-bound-angle',
    name: 'Baddha Konasana (Bound Angle Pose / Cobbler Pose)',
    description: 'Hip opener and inner thigh stretch',
    mechanic: 'hold',
    instructions: [
      'Sit with soles of feet together, knees falling to sides',
      'Hold feet with hands and sit up tall',
      'Gently press knees toward the floor',
      'You can lean forward for a deeper stretch',
      'Breathe deeply and relax'
    ],
    defaultDuration: 30,
    defaultSets: 2,
    targetMuscles: ['hips', 'inner thighs', 'groin']
  },
  {
    id: 'cooldown-cobra-pose',
    name: 'Bhujangasana (Cobra Pose)',
    description: 'Backbend that stretches the chest and strengthens the back',
    mechanic: 'hold',
    instructions: [
      'Lie face down with hands under shoulders',
      'Press into hands and lift chest off the ground',
      'Keep elbows slightly bent, shoulders back',
      'Look forward or slightly up',
      'Hold the position and breathe deeply'
    ],
    defaultDuration: 30,
    defaultSets: 2,
    targetMuscles: ['chest', 'abs', 'lower back']
  },
  {
    id: 'cooldown-standing-side-bend',
    name: 'Parsva Urdhva Hastasana (Standing Side Bend)',
    description: 'Lateral stretch for the obliques and intercostals',
    mechanic: 'hold',
    instructions: [
      'Stand with feet hip-width apart',
      'Raise arms overhead, interlace fingers',
      'Bend to one side, keeping hips stable',
      'Hold the stretch, then switch sides',
      'Feel the stretch along the side of your body'
    ],
    defaultDuration: 30,
    defaultSets: 2,
    targetMuscles: ['obliques', 'intercostals', 'lats']
  },
  {
    id: 'cooldown-pec-stretch-behind-back',
    name: 'Pec Stretch (Behind the Back Elbow to Elbow Grip)',
    description: 'Deep chest and shoulder stretch',
    mechanic: 'hold',
    instructions: [
      'Stand tall with good posture',
      'Reach both arms behind your back',
      'Try to grip elbow to elbow or clasp hands',
      'Pull shoulders back and lift chest',
      'Hold the stretch and breathe deeply'
    ],
    defaultDuration: 30,
    defaultSets: 2,
    targetMuscles: ['chest', 'shoulders', 'biceps']
  },
  {
    id: 'cooldown-doorway-pec-stretch',
    name: 'Pec Stretch (Doorway Pec Stretch)',
    description: 'Alternative chest stretch using a doorway',
    mechanic: 'hold',
    instructions: [
      'Stand in a doorway with arm bent at 90 degrees',
      'Place forearm against door frame',
      'Step forward with one foot',
      'Feel the stretch across your chest',
      'Hold, then switch sides'
    ],
    defaultDuration: 30,
    defaultSets: 2,
    targetMuscles: ['chest', 'shoulders']
  },
  {
    id: 'cooldown-bow-pose',
    name: 'Dhanurasana (Bow Pose)',
    description: 'Full body backbend stretch',
    mechanic: 'hold',
    instructions: [
      'Lie face down on the floor',
      'Bend knees and reach back to grab ankles',
      'Lift chest and thighs off the ground',
      'Pull feet away from hands to deepen the stretch',
      'Breathe deeply and hold'
    ],
    defaultDuration: 30,
    defaultSets: 2,
    targetMuscles: ['chest', 'abs', 'quadriceps', 'shoulders']
  }
];
