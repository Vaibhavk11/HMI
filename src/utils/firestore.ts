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
  } catch (error: any) {
    console.error('❌ Error fetching notes:', error);
    
    if (error.code === 'permission-denied') {
      throw new Error('Access denied. Please check Firestore security rules.');
    } else if (error.code === 'not-found') {
      throw new Error('Firestore database not found. Please set up Firestore in Firebase Console.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore service unavailable. Please check your internet connection.');
    } else {
      throw new Error(`Failed to load notes: ${error.message || 'Unknown error'}`);
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
  endTime?: Timestamp;
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

    const docRef = await addDoc(logsRef, {
      userId: uid,
      programId: workoutData.programId,
      weekNumber: workoutData.weekNumber,
      dayNumber: workoutData.dayNumber,
      date: Timestamp.fromDate(workoutData.startTime),
      startTime: Timestamp.fromDate(workoutData.startTime),
      endTime: Timestamp.fromDate(workoutData.endTime),
      completed: true,
      sections: workoutData.sections,
      notes: workoutData.notes || '',
      rating: workoutData.rating || 0,
    });

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

    await updateDoc(progressRef, {
      currentWeek: 1,
      currentDay: 1,
      startDate: Timestamp.now(),
      completedWorkouts: [],
      streak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    }).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, 'users', uid, 'progress'), {
        currentWeek: 1,
        currentDay: 1,
        startDate: Timestamp.now(),
        completedWorkouts: [],
        streak: 0,
        longestStreak: 0,
        lastWorkoutDate: null,
      });
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
