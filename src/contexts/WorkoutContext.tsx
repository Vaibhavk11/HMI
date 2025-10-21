import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { 
  WorkoutProgram, 
  DayWorkout, 
  WorkoutSection, 
  Exercise,
  ExerciseCompletion,
  UserProgress
} from '../types/workout';
import { twelveWeekProgram, getWorkoutByWeekAndDay } from '../data/workoutProgram';
import { 
  saveWorkoutLog, 
  updateUserProgress,
  getUserProgress,
  initializeUserProgress,
  isTodaysWorkoutCompleted,
  deleteTodaysWorkoutLogs
} from '../utils/firestore';

interface WorkoutContextType {
  program: WorkoutProgram | null;
  todaysWorkout: DayWorkout | null;
  currentSection: WorkoutSection | null;
  currentExercise: Exercise | null;
  currentExerciseIndex: number;
  currentSectionIndex: number;
  isWorkoutActive: boolean;
  workoutStartTime: Date | null;
  completedExercises: Set<string>;
  exerciseData: Map<string, ExerciseCompletion>;
  loading: boolean;
  error: string | null;
  currentWeek: number;
  userProgress: UserProgress | null;
  isTodayCompleted: boolean;
  
  startWorkout: () => void;
  completeExercise: (exerciseId: string, data: { reps?: number; duration?: number; sets?: number }) => void;
  skipExercise: () => void;
  previousExercise: () => void;
  completeWorkout: (notes?: string, rating?: number) => Promise<void>;
  setCurrentWeek: (week: number) => void;
  refreshProgress: () => Promise<void>;
  checkTodayCompleted: () => Promise<void>;
  resetTodaysWorkout: () => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [currentWeek, setCurrentWeekState] = useState<number>(1);
  const [todaysWorkout, setTodaysWorkout] = useState<DayWorkout | null>(null);
  const [currentSection, setCurrentSection] = useState<WorkoutSection | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [exerciseData, setExerciseData] = useState<Map<string, ExerciseCompletion>>(new Map());
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isTodayCompleted, setIsTodayCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load program and today's workout
  useEffect(() => {
    const loadWorkoutData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Load the 12-week program
        setProgram(twelveWeekProgram);
        
        // Check if user has progress data, if not initialize it
        const progress = await getUserProgress(user.uid);
        if (!progress) {
          await initializeUserProgress(user.uid);
          // Fetch again after initialization
          const newProgress = await getUserProgress(user.uid);
          setUserProgress(newProgress);
        } else {
          setUserProgress(progress);
          // Set current week from user progress if available
          if (progress.currentWeek) {
            setCurrentWeekState(progress.currentWeek);
          }
        }
        
        // Get today's workout based on current day of week
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // Convert Sunday (0) to 7
        
        const workout = getWorkoutByWeekAndDay(currentWeek, dayOfWeek);
        setTodaysWorkout(workout);
        
        // Check if today's workout is already completed
        if (workout && !workout.isRestDay) {
          const completed = await isTodaysWorkoutCompleted(
            user.uid,
            currentWeek,
            dayOfWeek
          );
          setIsTodayCompleted(completed);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load workout data:', err);
        setError('Failed to load workout data. Please try again.');
        setLoading(false);
      }
    };
    
    loadWorkoutData();
  }, [user, currentWeek]);
  
  // Get current exercise
  const currentExercise = currentSection?.exercises[currentExerciseIndex] || null;
  
  // Start a workout session
  const startWorkout = () => {
    if (!todaysWorkout || todaysWorkout.sections.length === 0) return;
    
    // Start with the first section (warm-up)
    setCurrentSection(todaysWorkout.sections[0]);
    setCurrentSectionIndex(0);
    setCurrentExerciseIndex(0);
    setIsWorkoutActive(true);
    setWorkoutStartTime(new Date());
    setCompletedExercises(new Set());
    setExerciseData(new Map());
    
    // Navigate to active workout screen
    navigate('/workout/active');
  };
  
  // Complete an exercise and move to next
  const completeExercise = (
    exerciseId: string, 
    data: { reps?: number; duration?: number; sets?: number }
  ) => {
    // Mark exercise as completed
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
    
    // Store exercise data
    setExerciseData(prev => {
      const newMap = new Map(prev);
      newMap.set(exerciseId, {
        exerciseId,
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
  
  // Skip current exercise
  const skipExercise = () => {
    moveToNextExercise();
  };
  
  // Move to previous exercise
  const previousExercise = () => {
    if (!currentSection || !todaysWorkout) return;
    
    if (currentExerciseIndex > 0) {
      // Move to previous exercise in same section
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Move to previous section's last exercise
      const prevSection = todaysWorkout.sections[currentSectionIndex - 1];
      setCurrentSection(prevSection);
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentExerciseIndex(prevSection.exercises.length - 1);
    }
  };
  
  // Helper to move to next exercise or section
  const moveToNextExercise = () => {
    if (!currentSection || !todaysWorkout) return;
    
    // Check if there are more exercises in current section
    if (currentExerciseIndex < currentSection.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Current section complete, move to next section
      if (currentSectionIndex < todaysWorkout.sections.length - 1) {
        const nextSection = todaysWorkout.sections[currentSectionIndex + 1];
        setCurrentSection(nextSection);
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentExerciseIndex(0);
      } else {
        // All sections complete - workout finished!
        navigate('/workout/complete');
      }
    }
  };
  
  // Complete the entire workout
  const completeWorkout = async (notes?: string, rating?: number) => {
    if (!user || !todaysWorkout || !workoutStartTime) {
      console.error('Cannot complete workout: missing required data');
      return;
    }
    
    try {
      const endTime = new Date();
      
      // Prepare workout log data
      const sections = todaysWorkout.sections.map(section => ({
        type: section.type,
        exercises: section.exercises
          .filter(ex => completedExercises.has(ex.id))
          .map(ex => {
            const data = exerciseData.get(ex.id);
            return data || {
              exerciseId: ex.id,
              sets: [],
            };
          }),
      }));
      
      // Save workout log to Firestore
      console.log('💾 Saving workout to Firestore...');
      const workoutLogId = await saveWorkoutLog(user.uid, {
        programId: twelveWeekProgram.id,
        weekNumber: currentWeek,
        dayNumber: todaysWorkout.dayNumber,
        startTime: workoutStartTime,
        endTime,
        sections,
        notes,
        rating,
      });
      
      // Update user progress
      console.log('📈 Updating user progress...');
      await updateUserProgress(user.uid, workoutLogId, currentWeek, todaysWorkout.dayNumber);
      
      console.log('✅ Workout completed and saved:', workoutLogId);
      
      // Reset workout state
      setIsWorkoutActive(false);
      setWorkoutStartTime(null);
      setCurrentSection(null);
      setCurrentSectionIndex(0);
      setCurrentExerciseIndex(0);
      setCompletedExercises(new Set());
      setExerciseData(new Map());
      
      // Refresh user progress to update UI
      await refreshProgress();
      
      // Mark today as completed
      await checkTodayCompleted();
      
      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      console.error('❌ Failed to complete workout:', err);
      setError('Failed to save workout. Please try again.');
      throw err;
    }
  };
  
  // Refresh user progress from Firestore
  const refreshProgress = async () => {
    if (!user) return;
    
    try {
      const progress = await getUserProgress(user.uid);
      setUserProgress(progress);
      
      // Update current week if progress has it
      if (progress?.currentWeek) {
        setCurrentWeekState(progress.currentWeek);
      }
    } catch (err) {
      console.error('Failed to refresh progress:', err);
    }
  };
  
  // Check if today's workout is already completed
  const checkTodayCompleted = async () => {
    if (!user || !todaysWorkout) return;
    
    try {
      const today = new Date();
      const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
      
      const completed = await isTodaysWorkoutCompleted(
        user.uid,
        currentWeek,
        dayOfWeek
      );
      setIsTodayCompleted(completed);
    } catch (err) {
      console.error('Failed to check today completed:', err);
    }
  };
  
  // Reset today's workout (delete logs and mark as incomplete)
  const resetTodaysWorkout = async () => {
    if (!user || !todaysWorkout) return;
    
    try {
      const today = new Date();
      const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
      
      console.log('🔄 Resetting today\'s workout...');
      
      // Delete all workout logs for today
      const deletedCount = await deleteTodaysWorkoutLogs(
        user.uid,
        currentWeek,
        dayOfWeek
      );
      
      if (deletedCount > 0) {
        // Mark as not completed
        setIsTodayCompleted(false);
        
        // Refresh progress to update stats
        await refreshProgress();
        
        console.log('✅ Workout reset successfully');
      } else {
        console.log('ℹ️ No workout logs found to delete');
      }
    } catch (err) {
      console.error('❌ Failed to reset workout:', err);
      throw err;
    }
  };
  
  // Set current week
  const setCurrentWeek = (week: number) => {
    if (week >= 1 && week <= 12) {
      setCurrentWeekState(week);
    }
  };
  
  const value: WorkoutContextType = {
    program,
    todaysWorkout,
    currentSection,
    currentExercise,
    currentExerciseIndex,
    currentSectionIndex,
    isWorkoutActive,
    workoutStartTime,
    completedExercises,
    exerciseData,
    loading,
    error,
    currentWeek,
    userProgress,
    isTodayCompleted,
    
    startWorkout,
    completeExercise,
    skipExercise,
    previousExercise,
    completeWorkout,
    setCurrentWeek,
    refreshProgress,
    checkTodayCompleted,
    resetTodaysWorkout
  };
  
  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
