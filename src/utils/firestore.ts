import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
  setDoc,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Note, NoteInput, FirestoreNote } from '../types';
import { WorkoutLog, UserProgress, ExerciseCompletion } from '../types/workout';

// Convert Firestore timestamp to Date
const timestampToDate = (timestamp: { seconds: number; nanoseconds: number }): Date => {
  return new Date(timestamp.seconds * 1000);
};

// Get user's notes collection reference
const getNotesCollection = (uid: string) => {
  return collection(db, 'users', uid, 'notes');
};

// Fetch all notes for a user
export const fetchNotes = async (uid: string): Promise<Note[]> => {
  try {
    console.log('🔍 Fetching notes for user:', uid);
    const notesRef = getNotesCollection(uid);
    const q = query(notesRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const notes: Note[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<FirestoreNote, 'id'>;
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        ownerUid: data.ownerUid,
      };
    });

    console.log('✅ Successfully fetched', notes.length, 'notes');
    return notes;
  } catch (error: unknown) {
    console.error('❌ Error fetching notes:', error);
    const err = error as { code?: string; message?: string };
    
    if (err.code === 'permission-denied') {
      throw new Error('Access denied. Please check Firestore security rules.');
    } else if (err.code === 'not-found') {
      throw new Error('Firestore database not found. Please set up Firestore in Firebase Console.');
    } else if (err.code === 'unavailable') {
      throw new Error('Firestore service unavailable. Please check your internet connection.');
    } else {
      throw new Error(`Failed to load notes: ${err.message || 'Unknown error'}`);
    }
  }
};

// Create a new note
export const createNote = async (uid: string, noteData: NoteInput): Promise<string> => {
  try {
    const notesRef = getNotesCollection(uid);
    const now = serverTimestamp();

    const docRef = await addDoc(notesRef, {
      ...noteData,
      ownerUid: uid,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (
  uid: string,
  noteId: string,
  noteData: Partial<NoteInput>
): Promise<void> => {
  try {
    const noteRef = doc(db, 'users', uid, 'notes', noteId);
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (uid: string, noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'users', uid, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Get a single note by ID
export const getNote = async (uid: string, noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, 'users', uid, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);

    if (noteSnap.exists()) {
      const data = noteSnap.data() as Omit<FirestoreNote, 'id'>;
      return {
        id: noteSnap.id,
        title: data.title,
        content: data.content,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        ownerUid: data.ownerUid,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting note:', error);
    throw error;
  }
};

// ============================================================
// WORKOUT LOG FUNCTIONS
// ============================================================

// Interface for Firestore workout log document
interface FirestoreWorkoutLog {
  userId: string;
  programId: string;
  weekNumber: number;
  dayNumber: number;
  date: Timestamp;
  startTime: Timestamp;
  endTime?: Timestamp; // Optional to handle old logs without endTime
  completed: boolean;
  sections: {
    type: string;
    exercises: ExerciseCompletion[];
  }[];
  notes?: string;
  rating?: number;
}

// Get user's workout logs collection reference
const getWorkoutLogsCollection = (uid: string) => {
  return collection(db, 'users', uid, 'workoutLogs');
};

// Save a completed workout log
export const saveWorkoutLog = async (
  uid: string,
  workoutData: {
    programId: string;
    weekNumber: number;
    dayNumber: number;
    startTime: Date;
    endTime: Date;
    sections: {
      type: string;
      exercises: ExerciseCompletion[];
    }[];
    notes?: string;
    rating?: number;
  }
): Promise<string> => {
  try {
    console.log('💾 Saving workout log for user:', uid);
    const logsRef = getWorkoutLogsCollection(uid);

    // Clean sections to remove undefined values
    const cleanedSections = workoutData.sections.map(section => ({
      type: section.type,
      exercises: section.exercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map(set => {
          const cleanSet: { completed: boolean; reps?: number; duration?: number } = { 
            completed: set.completed 
          };
          if (set.reps !== undefined) cleanSet.reps = set.reps;
          if (set.duration !== undefined) cleanSet.duration = set.duration;
          return cleanSet;
        }),
        ...(exercise.notes && { notes: exercise.notes })
      }))
    }));

    const workoutLogData = {
      userId: uid,
      programId: workoutData.programId,
      weekNumber: workoutData.weekNumber,
      dayNumber: workoutData.dayNumber,
      date: Timestamp.fromDate(workoutData.startTime),
      startTime: Timestamp.fromDate(workoutData.startTime),
      endTime: Timestamp.fromDate(workoutData.endTime),
      completed: true,
      sections: cleanedSections,
      notes: workoutData.notes || '',
      rating: workoutData.rating || 0,
    };
    
    console.log('💾 Workout data to save:', {
      ...workoutLogData,
      duration: `${Math.round((workoutData.endTime.getTime() - workoutData.startTime.getTime()) / 60000)} minutes`,
      startTime: workoutData.startTime.toISOString(),
      endTime: workoutData.endTime.toISOString(),
    });
    
    const docRef = await addDoc(logsRef, workoutLogData);

    console.log('✅ Workout log saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving workout log:', error);
    throw error;
  }
};

// Fetch all workout logs for a user
export const fetchWorkoutLogs = async (uid: string): Promise<WorkoutLog[]> => {
  try {
    console.log('🔍 Fetching workout logs for user:', uid);
    const logsRef = getWorkoutLogsCollection(uid);
    const q = query(logsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const logs: WorkoutLog[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreWorkoutLog;
      const log = {
        id: doc.id,
        userId: data.userId,
        programId: data.programId,
        weekNumber: data.weekNumber,
        dayNumber: data.dayNumber,
        date: data.date.toDate(),
        startTime: data.startTime.toDate(),
        endTime: data.endTime?.toDate(),
        completed: data.completed,
        sections: data.sections.map(section => ({
          type: section.type as 'warmup' | 'main' | 'cooldown',
          exercises: section.exercises,
        })),
        notes: data.notes,
        rating: data.rating,
      };
      
      // Log if endTime is missing for debugging
      if (!log.endTime) {
        console.warn('⚠️ Workout log missing endTime:', doc.id);
      }
      
      return log;
    });

    console.log('✅ Successfully fetched', logs.length, 'workout logs');
    return logs;
  } catch (error) {
    console.error('❌ Error fetching workout logs:', error);
    throw error;
  }
};

// Fetch workout logs for a specific week
export const fetchWorkoutLogsByWeek = async (
  uid: string,
  weekNumber: number
): Promise<WorkoutLog[]> => {
  try {
    const logsRef = getWorkoutLogsCollection(uid);
    const q = query(
      logsRef,
      where('weekNumber', '==', weekNumber),
      orderBy('dayNumber', 'asc')
    );
    const querySnapshot = await getDocs(q);

    const logs: WorkoutLog[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreWorkoutLog;
      return {
        id: doc.id,
        userId: data.userId,
        programId: data.programId,
        weekNumber: data.weekNumber,
        dayNumber: data.dayNumber,
        date: data.date.toDate(),
        startTime: data.startTime.toDate(),
        endTime: data.endTime?.toDate(),
        completed: data.completed,
        sections: data.sections.map(section => ({
          type: section.type as 'warmup' | 'main' | 'cooldown',
          exercises: section.exercises,
        })),
        notes: data.notes,
      };
    });

    return logs;
  } catch (error) {
    console.error('❌ Error fetching workout logs by week:', error);
    throw error;
  }
};

// Get a single workout log by ID
export const getWorkoutLog = async (
  uid: string,
  logId: string
): Promise<WorkoutLog | null> => {
  try {
    const logRef = doc(db, 'users', uid, 'workoutLogs', logId);
    const logSnap = await getDoc(logRef);

    if (logSnap.exists()) {
      const data = logSnap.data() as FirestoreWorkoutLog;
      return {
        id: logSnap.id,
        userId: data.userId,
        programId: data.programId,
        weekNumber: data.weekNumber,
        dayNumber: data.dayNumber,
        date: data.date.toDate(),
        startTime: data.startTime.toDate(),
        endTime: data.endTime?.toDate(),
        completed: data.completed,
        sections: data.sections.map(section => ({
          type: section.type as 'warmup' | 'main' | 'cooldown',
          exercises: section.exercises,
        })),
        notes: data.notes,
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error getting workout log:', error);
    throw error;
  }
};

// Check if today's workout has been completed
export const isTodaysWorkoutCompleted = async (
  uid: string,
  weekNumber: number,
  dayNumber: number
): Promise<boolean> => {
  try {
    const logsRef = getWorkoutLogsCollection(uid);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      logsRef,
      where('weekNumber', '==', weekNumber),
      where('dayNumber', '==', dayNumber),
      where('completed', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Check if any of the completed workouts are from today
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as FirestoreWorkoutLog;
      const workoutDate = data.date.toDate();
      workoutDate.setHours(0, 0, 0, 0);
      
      if (workoutDate.getTime() === today.getTime()) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error checking if workout is completed:', error);
    return false;
  }
};

// Delete today's workout logs for a specific day
export const deleteTodaysWorkoutLogs = async (
  uid: string,
  weekNumber: number,
  dayNumber: number
): Promise<number> => {
  try {
    console.log('🗑️ Deleting today\'s workout logs for week', weekNumber, 'day', dayNumber);
    const logsRef = getWorkoutLogsCollection(uid);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      logsRef,
      where('weekNumber', '==', weekNumber),
      where('dayNumber', '==', dayNumber)
    );
    
    const querySnapshot = await getDocs(q);
    let deletedCount = 0;
    const deletedLogIds: string[] = [];
    
    // Delete all workout logs from today
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data() as FirestoreWorkoutLog;
      const workoutDate = data.date.toDate();
      workoutDate.setHours(0, 0, 0, 0);
      
      if (workoutDate.getTime() === today.getTime()) {
        await deleteDoc(doc(db, 'users', uid, 'workoutLogs', docSnap.id));
        deletedLogIds.push(docSnap.id);
        deletedCount++;
        console.log('🗑️ Deleted workout log:', docSnap.id);
      }
    }
    
    // Update user progress to remove deleted workout IDs and recalculate currentWeek
    if (deletedLogIds.length > 0) {
      const progressRef = getUserProgressDoc(uid);
      const currentProgress = await getUserProgress(uid);
      
      if (currentProgress) {
        const updatedCompletedWorkouts = currentProgress.completedWorkouts.filter(
          id => !deletedLogIds.includes(id)
        );
        
        // Recalculate currentWeek from remaining workout logs
        let newCurrentWeek = 1;
        let newCurrentDay = 1;
        
        if (updatedCompletedWorkouts.length > 0) {
          // Fetch all remaining workout logs to find the latest week
          const allLogsQuery = query(logsRef, orderBy('date', 'desc'), limit(1));
          const latestLogSnapshot = await getDocs(allLogsQuery);
          
          if (!latestLogSnapshot.empty) {
            const latestLog = latestLogSnapshot.docs[0].data() as FirestoreWorkoutLog;
            newCurrentWeek = latestLog.weekNumber;
            newCurrentDay = latestLog.dayNumber;
            console.log('📊 Recalculated currentWeek to:', newCurrentWeek, 'currentDay to:', newCurrentDay);
          }
        } else {
          console.log('📊 No workouts remaining, resetting to week 1, day 1');
        }
        
        await updateDoc(progressRef, {
          completedWorkouts: updatedCompletedWorkouts,
          currentWeek: newCurrentWeek,
          currentDay: newCurrentDay
        });
        
        console.log('✅ Updated user progress: removed', deletedLogIds.length, 'workout IDs and reset currentWeek to', newCurrentWeek);
      }
    }
    
    console.log('✅ Deleted', deletedCount, 'workout logs');
    return deletedCount;
  } catch (error) {
    console.error('❌ Error deleting today\'s workout logs:', error);
    throw error;
  }
};

// ============================================================
// USER PROGRESS FUNCTIONS
// ============================================================

interface FirestoreUserProgress {
  currentWeek: number;
  currentDay: number;
  startDate: Timestamp;
  completedWorkouts: string[];
  streak: number;
  longestStreak: number;
  lastWorkoutDate?: Timestamp;
}

// Get user's progress document reference
const getUserProgressDoc = (uid: string) => {
  return doc(db, 'users', uid, 'progress', 'current');
};

// Get user's workout progress
export const getUserProgress = async (uid: string): Promise<UserProgress | null> => {
  try {
    console.log('🔍 Fetching user progress for:', uid);
    const progressRef = getUserProgressDoc(uid);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const data = progressSnap.data() as FirestoreUserProgress;
      return {
        currentWeek: data.currentWeek,
        currentDay: data.currentDay,
        startDate: data.startDate.toDate(),
        completedWorkouts: data.completedWorkouts,
        streak: data.streak,
        longestStreak: data.longestStreak,
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching user progress:', error);
    throw error;
  }
};

// Initialize user progress (when starting the program)
export const initializeUserProgress = async (uid: string): Promise<void> => {
  try {
    console.log('🎯 Initializing user progress for:', uid);
    const progressRef = getUserProgressDoc(uid);

    // Use setDoc to create document with fixed ID 'current'
    await setDoc(progressRef, {
      currentWeek: 1,
      currentDay: 1,
      startDate: Timestamp.now(),
      completedWorkouts: [],
      streak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    });

    console.log('✅ User progress initialized');
  } catch (error) {
    console.error('❌ Error initializing user progress:', error);
    throw error;
  }
};

// Update user progress after completing a workout
export const updateUserProgress = async (
  uid: string,
  workoutLogId: string,
  weekNumber: number,
  dayNumber: number
): Promise<void> => {
  try {
    console.log('📈 Updating user progress for:', uid);
    const progressRef = getUserProgressDoc(uid);
    const currentProgress = await getUserProgress(uid);

    if (!currentProgress) {
      await initializeUserProgress(uid);
      return updateUserProgress(uid, workoutLogId, weekNumber, dayNumber);
    }

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastWorkoutDate = currentProgress.completedWorkouts.length > 0 
      ? new Date() // This would need to be fetched from the last workout log
      : null;

    let newStreak = currentProgress.streak;
    if (lastWorkoutDate) {
      lastWorkoutDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1;
      }
      // If same day, keep current streak
    } else {
      newStreak = 1;
    }

    const newLongestStreak = Math.max(newStreak, currentProgress.longestStreak);

    await updateDoc(progressRef, {
      currentWeek: weekNumber,
      currentDay: dayNumber,
      completedWorkouts: [...currentProgress.completedWorkouts, workoutLogId],
      streak: newStreak,
      longestStreak: newLongestStreak,
      lastWorkoutDate: Timestamp.now(),
    });

    console.log('✅ User progress updated');
  } catch (error) {
    console.error('❌ Error updating user progress:', error);
    throw error;
  }
};
