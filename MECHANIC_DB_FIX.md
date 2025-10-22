# Exercise Mechanic Database Storage Fix

## Date: October 22, 2025

## Issue Description
Exercise mechanic type was not being saved to the Firestore database, causing the Progress page to be unable to determine whether to display reps or duration for each exercise. This led to incorrect display of workout data, especially for older workouts where the exercise definitions might have changed.

## Root Cause
When saving workout logs to Firestore, the `ExerciseCompletion` data structure only included:
- `exerciseId` (string reference)
- `sets` (array of set data with reps/duration)
- `notes` (optional)

The `mechanic` type (reps, timed, hold, failure, distance) was **not** being stored. The Progress page attempted to look up the exercise mechanic from the exercise definition map, but this approach had issues:
1. Exercise definitions might change over time
2. Lookup could fail if exercise ID changed
3. No fallback for missing exercise definitions

## Solution Implemented

### 1. Updated Type Definition ✅
**File:** `src/types/workout.ts`

Added `mechanic` field to `ExerciseCompletion` interface:
```typescript
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
```

### 2. Updated Workout Context ✅
**File:** `src/contexts/WorkoutContext.tsx`

Modified `completeExercise` function to store the mechanic:
```typescript
const completeExercise = (
  exerciseId: string, 
  data: { reps?: number; duration?: number; sets?: number }
) => {
  setExerciseData(prev => {
    const newMap = new Map(prev);
    
    // Find the exercise to get its mechanic type
    const exercise = currentExercise;
    
    newMap.set(exerciseId, {
      exerciseId,
      mechanic: exercise?.mechanic, // Store mechanic for proper display later
      sets: Array.from({ length: data.sets || 1 }, () => ({
        reps: data.reps,
        duration: data.duration,
        completed: true
      }))
    });
    return newMap;
  });
  
  moveToNextExercise();
};
```

### 3. Updated Firestore Save Function ✅
**File:** `src/utils/firestore.ts`

Modified `saveWorkoutLog` to include mechanic in saved data:
```typescript
const cleanedSections = workoutData.sections.map(section => ({
  type: section.type,
  exercises: section.exercises.map(exercise => ({
    exerciseId: exercise.exerciseId,
    ...(exercise.mechanic && { mechanic: exercise.mechanic }), // Store mechanic
    sets: exercise.sets.map(set => {
      // ... set data
    }),
    ...(exercise.notes && { notes: exercise.notes })
  }))
}));
```

### 4. Updated Progress Display Logic ✅
**File:** `src/pages/Progress.tsx`

Changed to prioritize mechanic from saved data:
```typescript
// Prioritize mechanic from saved data, fallback to exercise lookup
const mechanic = exerciseCompletion.mechanic || exercise?.mechanic;
const showReps = mechanic === 'reps';
const showDuration = mechanic === 'timed' || mechanic === 'hold' || 
                     mechanic === 'failure' || mechanic === 'distance';
```

## Benefits

### Data Reliability
✅ Exercise mechanic is now permanently stored with workout logs
✅ Display is not dependent on current exercise definitions
✅ Historical data remains accurate even if exercise definitions change

### Backward Compatibility
✅ Fallback to exercise lookup for old data without mechanic field
✅ No migration needed for existing data
✅ Graceful degradation for missing mechanic values

### Future-Proof
✅ Workout logs are self-contained
✅ Exercise definitions can be updated without breaking old logs
✅ Exercise IDs can be changed without losing display context

## Testing Checklist

### New Workouts (After Fix)
- [ ] Complete a rep-based exercise (push-ups)
  - Verify mechanic='reps' is saved to Firestore
  - Check Progress page displays reps correctly
- [ ] Complete a timed exercise (jogging)
  - Verify mechanic='timed' is saved to Firestore
  - Check Progress page displays duration in readable format
- [ ] Complete a hold exercise (grip-and-hang)
  - Verify mechanic='hold' is saved to Firestore
  - Check Progress page displays duration correctly
- [ ] Complete a failure exercise
  - Verify mechanic='failure' is saved to Firestore
  - Check Progress page displays duration correctly

### Legacy Data (Before Fix)
- [ ] View old workouts without mechanic field
  - Should fallback to exercise definition lookup
  - Should display correctly if exercise still exists
- [ ] Verify no errors if exercise definition is missing

### Database Verification
- [ ] Check Firestore console for new workout logs
- [ ] Verify `mechanic` field is present in exercise completions
- [ ] Confirm field format matches ExerciseMechanic type

## Database Schema

### Before Fix
```json
{
  "workoutLogs": {
    "exercises": [
      {
        "exerciseId": "exercise-push-ups",
        "sets": [
          { "reps": 12, "completed": true }
        ]
      }
    ]
  }
}
```

### After Fix
```json
{
  "workoutLogs": {
    "exercises": [
      {
        "exerciseId": "exercise-push-ups",
        "mechanic": "reps",
        "sets": [
          { "reps": 12, "completed": true }
        ]
      }
    ]
  }
}
```

## Migration Notes

**No migration required!** 

The solution includes backward compatibility:
- Old logs without `mechanic` field will fallback to exercise definition lookup
- New logs will include `mechanic` field automatically
- Display logic handles both cases gracefully

## Related Fixes

This fix works in conjunction with:
1. **Duration Display Fix** - Proper formatting of duration (Xm Ys instead of Xs)
2. **Metric Validation** - Only showing non-zero values for reps/duration
3. **Clean Data Storage** - Only storing relevant metrics (not both reps AND duration)

## Files Modified

1. ✅ `src/types/workout.ts` - Added mechanic to ExerciseCompletion
2. ✅ `src/contexts/WorkoutContext.tsx` - Store mechanic when completing exercise
3. ✅ `src/utils/firestore.ts` - Save mechanic to Firestore
4. ✅ `src/pages/Progress.tsx` - Use saved mechanic with fallback

## Impact Assessment

### Positive Impact
- ✅ Reliable exercise data display
- ✅ Self-contained workout logs
- ✅ Future-proof against exercise definition changes
- ✅ Better data integrity

### No Breaking Changes
- ✅ Backward compatible with existing data
- ✅ No user action required
- ✅ Automatic improvement for new workouts

## Verification Commands

To verify the fix is working, check your browser console for:
```
💾 Workout data to save: { ... }
```

Look for the `mechanic` field in the exercises array.

You can also check Firestore directly:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Open: `users/{userId}/workoutLogs/{logId}`
4. Check `sections[].exercises[].mechanic` field
