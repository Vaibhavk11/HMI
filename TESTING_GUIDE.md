# Progressive Workout System - Testing Guide

## Quick Test Steps

### 1. **Verify Week 1 (Base Program)**
1. Open app: http://localhost:5173/HMI/
2. Login/Register if needed
3. Check Dashboard - Should show Week 1
4. Start a workout on Monday (Strength Day)
5. **Expected exercises:**
   - Free Squats (15 reps, 2 sets)
   - Single Leg Calf Raise (12 reps, 1 set)
   - Inverted Rows (8 reps, 2 sets)
   - Push Ups (8 reps, 2 sets)
   - Prone Alternate Arm/Leg Raise (10 reps, 2 sets)
   - Partial Crunches (8 reps, 2 sets)
   - Grip and Hang (1 set, failure)

### 2. **Test Week Progression**
To test different weeks, you can:
- **Option A**: Complete workouts naturally to advance weeks
- **Option B**: Use Firebase Console to manually set `currentWeek` field

### 3. **Key Things to Verify**

#### ✅ **Week 1-3 (Bodyweight)**
- No weight mentions
- Basic exercises only
- Cardio: 12-15 minutes

#### ✅ **Week 4 (First Weighted Week)**
- Exercises show "5kgs" in description
- New exercises appear: Goblet Squats, Weighted Rows, Weighted Push-ups, Pinch Holds
- Full Crunches replace Partial Crunches

#### ✅ **Week 7 (Advanced Movements)**
- Chin-ups appear (5 reps)
- Parallel Bar Dips appear (5 reps)
- Superman Hold appears
- Weight notes show "10kgs"

#### ✅ **Week 12 (Peak)**
- Chin-ups/Dips: 12 reps
- Weight notes: "15kgs / 17.5kgs / 20kgs"
- Cardio: 30 minutes
- Most exercises: 3 sets

### 4. **Check Cardio Days (Tue/Thu/Sat)**
- Week 1-2: 12 minutes
- Week 3-4: 15 minutes
- Week 5-6: 17 minutes
- Week 7-8: 20 minutes
- Week 9-10: 25 minutes
- Week 11-12: 30 minutes

### 5. **Verify UI Elements**
- [ ] Exercise names display correctly
- [ ] Sets/reps show correct numbers per week
- [ ] Weight recommendations visible in exercise descriptions
- [ ] Instructions button works
- [ ] Warmup/Cooldown sections present
- [ ] Timer works for cardio
- [ ] Rep counter works for strength

---

## Manual Week Testing (For Developers)

### Using Browser Console:
```javascript
// Check current week
console.log('Current Week:', userProgress.currentWeek);

// Or check workout data
console.log('Today\'s workout:', currentWorkout);
```

### Using Firebase Console:
1. Go to Firestore Database
2. Navigate to: `users/{uid}`
3. Edit `currentWeek` field (1-12)
4. Refresh app

---

## Expected Behavior by Week

| Week | New Exercises | Weight | Cardio | Key Changes |
|------|---------------|--------|--------|-------------|
| 1 | Base program | 0kg | 12min | Foundation |
| 2 | - | 0kg | 12min | +Sets |
| 3 | Standing Calf Raise | 0kg | 15min | Both legs calf |
| 4 | Goblet Squats, Weighted exercises, Pinch Holds, Full Crunches | 5kg | 15min | WEIGHTS START |
| 5 | Superman Hold | 7.5kg | 17min | +Weight |
| 6 | - | 7.5kg | 17min | +Sets |
| 7 | Chin-ups, Dips | 10kg | 20min | ADVANCED MOVES |
| 8 | - | 10kg | 20min | +Volume |
| 9 | - | 12.5-15kg | 25min | +Weight |
| 10 | - | 12.5-15kg | 25min | +Sets |
| 11 | - | 15-20kg | 30min | HEAVY WEIGHT |
| 12 | - | 15-20kg | 30min | PEAK VOLUME |

---

## Common Issues & Solutions

### Issue: Exercises not changing between weeks
**Solution**: Check that `weeklyWorkoutConfigs` is imported correctly in `workoutProgram.ts`

### Issue: TypeScript errors
**Solution**: Run `npm run build` to see specific errors

### Issue: Wrong exercises showing
**Solution**: Verify `currentWeek` in user progress matches expected week

### Issue: Weight notes not visible
**Solution**: Check exercise `description` field in weekly configs

---

## Testing Checklist

- [ ] Week 1 shows bodyweight exercises only
- [ ] Week 2 increases sets/reps
- [ ] Week 3 changes to Standing Calf Raise (both legs)
- [ ] Week 4 introduces weights (5kg notes visible)
- [ ] Week 5 increases to 7.5kg, adds Superman
- [ ] Week 6 maintains 7.5kg, increases sets
- [ ] Week 7 adds Chin-ups and Dips (10kg)
- [ ] Week 8 increases volume (10kg)
- [ ] Week 9 increases weight (12.5-15kg)
- [ ] Week 10 increases sets (12.5-15kg)
- [ ] Week 11 heavy weight (15-20kg)
- [ ] Week 12 peak performance (15-20kg, max volume)
- [ ] Cardio duration increases correctly
- [ ] Rest day on Sunday all weeks
- [ ] Warmup/Cooldown consistent across weeks

---

## Screenshot Checklist

For documentation, capture:
1. Week 1 strength day exercise list
2. Week 4 strength day (first weighted week)
3. Week 7 strength day (chin-ups/dips)
4. Week 12 strength day (peak performance)
5. Cardio progression (12min vs 30min)
6. Progress page showing multiple weeks

---

## Success Criteria

✅ **All 12 weeks have unique configurations**
✅ **Progressive overload visible in UI**
✅ **No errors in console**
✅ **Exercises load correctly per week**
✅ **Weight recommendations display**
✅ **Cardio duration increases**
✅ **User can complete workouts and progress**

---

## Quick Smoke Test (5 minutes)

1. Start app → Login
2. Check Dashboard → Verify Week 1
3. Start Monday workout → Verify 7 exercises (bodyweight)
4. Start Tuesday workout → Verify 12min jogging
5. (Optional) Change to Week 4 manually → Verify weights mentioned
6. (Optional) Change to Week 7 manually → Verify chin-ups/dips present

✅ If all above work, implementation is successful!
