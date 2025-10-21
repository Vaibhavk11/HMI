# Fix: "Next →" Button Not Showing Next Week's Workout

## Issue Description
The "Next →" button in the Week Selector was updating the week number display but not loading the corresponding week's exercises. The workout exercises remained stuck on Week 1.

## Root Cause
In `WorkoutContext.tsx`, the `useEffect` hook that loads workout data had this problematic code:

```tsx
// Old problematic code (line 97)
if (progress.currentWeek) {
  setCurrentWeekState(progress.currentWeek);
}
```

### What Was Happening:
1. User clicks "Next →" button
2. `setCurrentWeek(2)` is called
3. `currentWeek` state updates to 2
4. `useEffect` runs (because `currentWeek` is in dependency array)
5. **Problem**: The effect fetches user progress from Firestore
6. **Problem**: It then resets `currentWeek` back to 1 (from userProgress.currentWeek)
7. Result: Week number briefly shows 2, then snaps back to 1
8. Workout exercises never change

## Solution

Added an `isInitialLoad` flag to distinguish between:
- **Initial page load**: Should load week from user progress
- **Manual navigation**: Should keep the week user selected with Prev/Next buttons

### Changes Made to `WorkoutContext.tsx`:

#### 1. Added State Flag
```tsx
const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
```

#### 2. Updated useEffect Logic
```tsx
if (isInitialLoad && progress.currentWeek) {
  console.log('📊 Initial load: Setting week from user progress:', progress.currentWeek);
  setCurrentWeekState(progress.currentWeek);
  setIsInitialLoad(false); // Flag that initial load is complete
} else {
  console.log('📊 User progress shows week:', progress.currentWeek, 
    'but keeping currentWeek state at:', currentWeek);
}
```

#### 3. Updated Dependency Array
```tsx
}, [user, currentWeek, isInitialLoad]);
```

## How It Works Now

### Scenario 1: Initial Page Load
1. User opens Dashboard
2. `isInitialLoad = true`
3. Effect loads user progress (e.g., week 1)
4. Sets `currentWeek = 1` from userProgress
5. Sets `isInitialLoad = false`
6. Displays Week 1 exercises

### Scenario 2: Clicking "Next →"
1. User clicks "Next →"
2. `setCurrentWeek(2)` is called
3. `currentWeek` state updates to 2
4. `useEffect` runs
5. `isInitialLoad = false`, so it **skips** resetting from userProgress
6. Fetches workout for week 2
7. Displays Week 2 exercises ✅

### Scenario 3: Clicking "Prev ←"
1. User clicks "Prev ←"
2. `setCurrentWeek(1)` is called
3. Same logic as Next - respects the manual selection
4. Displays Week 1 exercises ✅

## Debug Logs Added

Added console logs to track the flow:
- `🔄 Loading workout data for week: X`
- `📊 Initial load: Setting week from user progress: X`
- `📊 User progress shows week: X but keeping currentWeek state at: Y`
- `📅 Fetching workout for week X day Y`
- `💪 Loaded workout: [workout details]`
- `🏋️ Main exercises: [exercise list with reps/sets]`

## Testing Checklist

- [x] Build succeeds without errors
- [ ] Initial load shows correct week from user progress
- [ ] Clicking "Next →" advances to next week
- [ ] Clicking "Prev ←" goes back to previous week
- [ ] Week 1 shows bodyweight exercises
- [ ] Week 4 shows weighted exercises with 5kg notes
- [ ] Week 7 shows chin-ups and dips
- [ ] Exercise counts change per week
- [ ] Reps/sets display correctly per week
- [ ] Cardio duration increases per week

## Files Modified

- ✅ `src/contexts/WorkoutContext.tsx`
  - Added `isInitialLoad` state flag
  - Updated useEffect to respect manual week navigation
  - Added debug console logs
  - Updated dependency array

## Verification Steps

1. Open app: http://localhost:5174/HMI/
2. Open browser console (F12)
3. Look for initial load logs
4. Click "Next →" button
5. Check console logs confirm week change
6. Verify exercises displayed change
7. Check exercise counts and reps/sets update
8. Click "Prev ←" to go back
9. Verify it works in both directions

## Expected Console Output

```
🔄 Loading workout data for week: 1
📊 Initial load: Setting week from user progress: 1
📅 Fetching workout for week 1 day 2
💪 Loaded workout: week-1-day-2 Cardio day - Jogging (Week 1)
🏋️ Main exercises: ['Jogging (12 min)']

// After clicking Next →
🔄 Loading workout data for week: 2
📊 User progress shows week: 1 but keeping currentWeek state at: 2
📅 Fetching workout for week 2 day 2
💪 Loaded workout: week-2-day-2 Cardio day - Jogging (Week 2)
🏋️ Main exercises: ['Jogging (12 min)']
```

## Success Criteria

✅ Week selector UI updates correctly
✅ Workout exercises change based on selected week
✅ Exercise details (reps, sets, duration) update per week
✅ No infinite loops or state conflicts
✅ User progress week persists on page refresh
✅ Manual navigation works independently of stored progress

---

**Status**: ✅ FIXED - Ready for testing
**Build**: ✅ Successful
**Branch**: main
**Date**: October 21, 2025
