# Set Tracking Fix - Individual Set Data Capture

## Issue
When completing exercises with multiple sets (especially duration-based exercises), all sets were being saved with the same value - specifically the last completed set's value.

**Example Bug:**
- Cooldown exercise with 2 sets
- Set 1: 4 seconds
- Set 2: 5 seconds
- **Database Result:** Both sets showing 5 seconds ❌

## Root Cause
Both `TestWorkout.tsx` and `ActiveWorkout.tsx` (via `WorkoutContext.tsx`) were creating all sets at once using `Array.from()` with the current timer/reps values, rather than tracking each set individually as it was completed.

### Bug Location (Before Fix)
```typescript
// TestWorkout.tsx - Line 176-191
sets: Array.from({ length: totalSets }, () => {
  const setData = { completed: true };
  if (currentExercise.mechanic === 'reps') {
    setData.reps = reps; // ❌ Uses final reps value for ALL sets
  } else {
    setData.duration = timer; // ❌ Uses final timer value for ALL sets
  }
  return setData;
})
```

## Solution
Track each set's data individually as it's completed using a state array:

### 1. TestWorkout.tsx Changes
- **Added State:** `completedSetsData` array to store each set's data
- **Modified:** `handleCompleteSet` to append set data as each set completes
- **Modified:** `useEffect` to reset the array when exercise changes

### 2. ActiveWorkout.tsx Changes
- **Added State:** `completedSetsData` array to store each set's data
- **Modified:** `handleCompleteSet` to append set data as each set completes
- **Modified:** `useEffect` to reset the array when exercise changes
- **Modified:** Pass `completedSetsData` to `completeExercise` function

### 3. WorkoutContext.tsx Changes
- **Updated:** `completeExercise` function signature to accept optional `setsData` array
- **Modified:** Use provided `setsData` if available, otherwise fall back to old behavior

## Implementation Details

### State Addition (Both Files)
```typescript
const [completedSetsData, setCompletedSetsData] = useState<Array<{
  completed: boolean; 
  reps?: number; 
  duration?: number 
}>>([]); // Track each set's data
```

### Set Data Capture (Both Files)
```typescript
const handleCompleteSet = () => {
  // Store the current set's data
  const setData: { completed: boolean; reps?: number; duration?: number } = {
    completed: true
  };
  
  // Only include relevant metric
  if (currentExercise.mechanic === 'reps') {
    setData.reps = reps;
  } else if (['timed', 'hold', 'failure'].includes(currentExercise.mechanic)) {
    setData.duration = timer;
  }
  
  // Add this set's data to the array
  const updatedSetsData = [...completedSetsData, setData];
  setCompletedSetsData(updatedSetsData);
  
  // ... rest of function uses updatedSetsData
};
```

### Reset on Exercise Change (Both Files)
```typescript
useEffect(() => {
  if (currentExercise) {
    // ... other resets
    setCompletedSetsData([]); // Reset for new exercise
  }
}, [currentSectionIndex, currentExerciseIndex, workout]);
```

### Context Update (WorkoutContext.tsx)
```typescript
const completeExercise = (
  exerciseId: string, 
  data: { reps?: number; duration?: number; sets?: number },
  setsData?: Array<{ completed: boolean; reps?: number; duration?: number }>
) => {
  // ...
  newMap.set(exerciseId, {
    exerciseId,
    mechanic: exercise?.mechanic,
    sets: setsData || Array.from({ length: data.sets || 1 }, () => ({
      reps: data.reps,
      duration: data.duration,
      completed: true
    }))
  });
};
```

## Result
✅ Each set now saves its individual duration/reps value  
✅ Database correctly shows: Set 1 = 4s, Set 2 = 5s  
✅ Works for both test mode and real workouts  
✅ Backward compatible (falls back to old behavior if no setsData provided)  

## Testing Scenarios
1. **Duration Exercise (2+ sets):**
   - Complete set 1 with timer at 4 seconds
   - Complete set 2 with timer at 5 seconds
   - Check database: Set 1 should be 4s, Set 2 should be 5s

2. **Reps Exercise (3+ sets):**
   - Complete set 1 with 8 reps
   - Complete set 2 with 10 reps
   - Complete set 3 with 12 reps
   - Check database: Each set should have its correct rep count

3. **Mixed Workout:**
   - Test both test mode and active workout
   - Verify Progress page displays correctly
   - Check Firestore database structure

## Files Modified
- `src/pages/TestWorkout.tsx` - Added per-set tracking
- `src/pages/ActiveWorkout.tsx` - Added per-set tracking
- `src/contexts/WorkoutContext.tsx` - Updated completeExercise signature

## Date
2025-01-XX (current session)
