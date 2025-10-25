// Helper script to add imageUrl to all exercises
// This maps exercise IDs to their image filenames

// Use base path for GitHub Pages deployment, fallback to root for local dev
const BASE_PATH = import.meta.env.BASE_URL || '/';

console.log('🔍 Exercise Images - BASE_PATH:', BASE_PATH);
console.log('🔍 Exercise Images - import.meta.env.BASE_URL:', import.meta.env.BASE_URL);

const getImagePath = (filename: string) => {
  const path = `${BASE_PATH}exercise-images/${filename}`;
  console.log(`📸 Generated image path for ${filename}:`, path);
  return path;
};

export const exerciseImageMap: Record<string, string> = {
  // Warmup exercises
  'warmup-neck-rotations': getImagePath('neck-rotations.png'),
  'warmup-arm-swings': getImagePath('arm-swings.png'),
  'warmup-shoulder-circumduction': getImagePath('shoulder-circumduction.png'),
  'warmup-dynamic-chest-stretch': getImagePath('dynamic-chest-stretch.png'),
  'warmup-side-bends': getImagePath('side-bends.png'),
  'warmup-windmill': getImagePath('windmill.png'),
  'warmup-cat-camel': getImagePath('cat-camel.png'),
  'warmup-hip-flexion-rotation': getImagePath('hip-flexion-rotation.png'),
  'warmup-leg-swings-front-back': getImagePath('leg-swings-front-back.png'),
  'warmup-leg-swings-side': getImagePath('leg-swings-side.png'),
  'warmup-spider-lunges': getImagePath('spider-lunges.png'),
  'warmup-high-knees': getImagePath('high-knees.png'),

  // Main exercises
  'exercise-free-squats': getImagePath('free-squats.png'),
  'exercise-single-leg-calf-raise': getImagePath('single-leg-calf-raise.png'),
  'exercise-inverted-rows': getImagePath('inverted-rows.png'),
  'exercise-push-ups': getImagePath('push-ups.png'),
  'exercise-regressed-push-ups': getImagePath('regressed-push-ups.png'),
  'exercise-prone-alternate-arm-leg-raise': getImagePath('prone-alternate-arm-leg-raise.png'),
  'exercise-partial-crunches': getImagePath('partial-crunches.png'),
  'exercise-grip-and-hang': getImagePath('grip-and-hang.png'),
  'exercise-jogging': getImagePath('jogging.png'),
  'exercise-standing-calf-raise': getImagePath('standing-calf-raise.png'),
  'exercise-goblet-squats': getImagePath('goblet-squats.png'),
  'exercise-inverted-rows-weighted': getImagePath('inverted-rows-weighted.png'),
  'exercise-push-ups-weighted': getImagePath('push-ups-weighted.png'),
  'exercise-full-crunches': getImagePath('full-crunches.png'),
  'exercise-grip-and-hang-weighted': getImagePath('grip-and-hang-weighted.png'),
  'exercise-pinch-holds': getImagePath('pinch-holds.png'),
  'exercise-superman-hold': getImagePath('superman-hold.png'),
  'exercise-wide-grip-chin-up': getImagePath('wide-grip-chin-up.png'),
  'exercise-parallel-bar-dip': getImagePath('parallel-bar-dip.png'),

  // Cooldown exercises
  'cooldown-seated-forward-bend': getImagePath('seated-forward-bend.png'),
  'cooldown-bound-angle': getImagePath('bound-angle.png'),
  'cooldown-cobra-pose': getImagePath('cobra-pose.png'),
  'cooldown-standing-side-bend': getImagePath('standing-side-bend.png'),
  'cooldown-pec-stretch-behind-back': getImagePath('pec-stretch-behind-back.png'),
  'cooldown-doorway-pec-stretch': getImagePath('doorway-pec-stretch.png'),
  'cooldown-bow-pose': getImagePath('bow-pose.png'),
};
