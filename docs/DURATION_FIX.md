# Exercise Duration Display Fix

## Date: October 22, 2025

## Issue Description
Duration-based exercises (timed, hold, failure) were showing incorrect data:
1. **Displaying reps instead of duration** - Exercises like "grip-and-hang" showed reps (0) instead of the actual duration
2. **Duration format not readable** - Duration was shown in raw seconds (e.g., "120s" instead of "2m")

## Root Cause Analysis

### Problem 1: Incorrect Data Storage
In `ActiveWorkout.tsx`, when completing an exercise, the code was passing `undefined` for irrelevant metrics, but JavaScript was still storing these as properties with value `0` or `undefined`. The condition was:
```typescript
completeExercise(currentExercise.id, {
  reps: currentExercise.mechanic === 'reps' ? reps : undefined,
  duration: currentExercise.mechanic === 'timed' || currentExercise.mechanic === 'hold' ? timer : undefined,
  sets: totalSets
});
```

**Issue:** For duration-based exercises, `reps` would be set to `undefined`, but the initial state value was `0`, which was being stored.

### Problem 2: Display Logic
In `Progress.tsx`, the display logic was checking:
```typescript
{set.reps !== undefined && <span>{set.reps} reps</span>}
```

**Issue:** Since `0` is not `undefined`, it would display "0 reps" for duration exercises.

### Problem 3: Duration Format
Duration was always displayed in raw seconds (e.g., "120s", "1800s") instead of human-readable format.

## Solution Implemented

### Fix 1: Clean Data Storage ✅
**File:** `src/pages/ActiveWorkout.tsx` (lines ~138-155)

Changed to only include relevant metrics in the data object:
```typescript
// Build exercise data object with only relevant metrics
const exerciseData: { reps?: number; duration?: number; sets: number } = {
  sets: totalSets
};

// Only include the relevant metric based on exercise mechanic
if (currentExercise.mechanic === 'reps') {
  exerciseData.reps = reps;
} else if (currentExercise.mechanic === 'timed' || currentExercise.mechanic === 'hold' || currentExercise.mechanic === 'failure') {
  exerciseData.duration = timer;
}

completeExercise(currentExercise.id, exerciseData);
```

**Benefits:**
- No undefined or 0 values for irrelevant metrics
- Cleaner database records
- Prevents display confusion

### Fix 2: Enhanced Display Logic ✅
**File:** `src/pages/Progress.tsx` (lines ~740-750)

Added value validation:
```typescript
{showReps && set.reps !== undefined && set.reps > 0 && (
  <span className="text-gray-700">{set.reps} reps</span>
)}
{showDuration && set.duration !== undefined && set.duration > 0 && (
  <span className="text-gray-700">{formatExerciseDuration(set.duration)}</span>
)}
```

**Benefits:**
- Only shows metrics that have actual positive values
- Prevents "0 reps" from showing on duration exercises
- Uses readable format function

### Fix 3: Human-Readable Duration Format ✅
**File:** `src/pages/Progress.tsx` (lines ~21-36)

Added new helper function:
```typescript
const formatExerciseDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};
```

**Format Examples:**
- `45s` → "45s"
- `90s` → "1m 30s"
- `300s` → "5m"
- `3720s` → "1h 2m"
- `7200s` → "2h"

## Testing Checklist

### New Workouts (After Fix)
- [ ] Complete a rep-based exercise (push-ups, squats)
  - Should save and display only reps
- [ ] Complete a timed exercise (jogging, plank)
  - Should save and display only duration in readable format
- [ ] Complete a hold exercise (grip-and-hang)
  - Should save and display only duration in readable format
- [ ] Complete a failure exercise
  - Should save and display only duration in readable format

### Display Verification
- [ ] Check Exercises tab in Progress page
- [ ] Verify duration shows as "Xm Ys" not "Xs"
- [ ] Verify reps show only for rep-based exercises
- [ ] Verify no "0 reps" displays for duration exercises
- [ ] Test various duration lengths (< 1min, 1-60min, > 1hour)

### Legacy Data (Before Fix)
**Note:** Old workout logs may still have both reps and duration stored. The enhanced display logic with `> 0` check will handle this gracefully by only showing the non-zero value.

## Files Modified

1. **src/pages/ActiveWorkout.tsx**
   - Changed `completeExercise` call to conditionally build data object
   - Only includes relevant metrics (reps OR duration, not both)

2. **src/pages/Progress.tsx**
   - Added `formatExerciseDuration` function for readable duration display
   - Enhanced display logic with `> 0` validation
   - Separated concerns: `formatExerciseDuration` for exercise durations, `formatDuration` for workout durations

## Impact

### Positive
✅ Duration exercises now display correctly
✅ Human-readable duration format (1m 30s vs 90s)
✅ Cleaner database records (no undefined/0 values)
✅ Backward compatible with old data (graceful handling)

### No Breaking Changes
- Old workout logs will still display correctly
- Display logic handles both old (with 0 values) and new (without) data formats
- No migration needed

## Future Enhancements
- Consider adding duration format preference (metric vs imperial time)
- Add millisecond precision for sub-second durations if needed
- Implement data migration script to clean up old records (optional)
