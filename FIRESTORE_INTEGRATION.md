# Firestore Integration for Workout Tracker

This document explains how workout data is saved to Firebase Firestore.

## Data Structure

### Collection: `users/{uid}/workoutLogs`

Each completed workout is saved as a document with the following structure:

```typescript
{
  id: string;                    // Auto-generated document ID
  userId: string;                // User's Firebase UID
  programId: string;             // "12-week-fitness-program"
  weekNumber: number;            // 1-12
  dayNumber: number;             // 1-7 (Monday-Sunday)
  date: Timestamp;               // Workout date
  startTime: Timestamp;          // When workout started
  endTime: Timestamp;            // When workout completed
  completed: boolean;            // Always true for saved logs
  rating: number;                // 1-5 stars
  notes: string;                 // User's notes
  sections: [                    // Array of completed sections
    {
      type: "warmup" | "main" | "cooldown";
      exercises: [
        {
          exerciseId: string;
          sets: [
            {
              reps?: number;     // For rep-based exercises
              duration?: number; // For timed exercises (seconds)
              completed: boolean;
            }
          ];
          notes?: string;
        }
      ]
    }
  ]
}
```

### Collection: `users/{uid}/progress`

User's overall progress is tracked in a single document (`current`):

```typescript
{
  currentWeek: number;           // Current week (1-12)
  currentDay: number;            // Current day (1-7)
  startDate: Timestamp;          // When user started program
  completedWorkouts: string[];   // Array of workout log IDs
  streak: number;                // Current workout streak (days)
  longestStreak: number;         // Longest streak achieved
  lastWorkoutDate: Timestamp;    // Last completed workout date
}
```

## Firestore Functions

All Firestore operations are in `src/utils/firestore.ts`:

### Workout Logs

- **`saveWorkoutLog(uid, workoutData)`** - Save a completed workout
- **`fetchWorkoutLogs(uid)`** - Get all workout logs for a user
- **`fetchWorkoutLogsByWeek(uid, weekNumber)`** - Get logs for a specific week
- **`getWorkoutLog(uid, logId)`** - Get a single workout log

### User Progress

- **`getUserProgress(uid)`** - Get user's progress data
- **`initializeUserProgress(uid)`** - Initialize progress for new users
- **`updateUserProgress(uid, logId, week, day)`** - Update after workout completion

## Security Rules

Firestore security rules ensure users can only access their own data:

```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  match /workoutLogs/{logId} {
    allow read: if request.auth.uid == userId;
    allow create: if request.auth.uid == userId 
                  && request.resource.data.userId == userId;
    allow update, delete: if request.auth.uid == userId;
  }
  
  match /progress/{progressId} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

## Workflow

1. **User starts workout** - `WorkoutContext.startWorkout()`
   - Sets `workoutStartTime`
   - Navigates to `/workout/active`

2. **User completes exercises** - `WorkoutContext.completeExercise()`
   - Tracks completed exercises and their data
   - Moves to next exercise/section

3. **User finishes workout** - Navigates to `/workout/complete`
   - User adds rating (1-5 stars)
   - User adds optional notes

4. **User saves workout** - `WorkoutContext.completeWorkout(notes, rating)`
   - Creates workout log document in Firestore
   - Updates user progress document
   - Calculates workout streak
   - Navigates back to dashboard

## Testing Locally

1. Ensure `.env` file has Firebase credentials
2. Start dev server: `npm run dev`
3. Sign in with Google
4. Complete a workout
5. Check Firestore Console to verify data was saved

## Deploying Security Rules

To deploy updated security rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

Or deploy through the Firebase Console:
1. Go to Firestore Database
2. Click "Rules" tab
3. Copy contents of `firestore.rules`
4. Click "Publish"

## Future Enhancements

- Add workout history page
- Display progress charts and statistics
- Show workout calendar with completion status
- Add social features (share workouts, leaderboards)
- Implement workout reminders and notifications
