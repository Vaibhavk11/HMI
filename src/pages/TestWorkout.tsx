import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getWorkoutByWeekAndDay } from '../data/workoutProgram';
import { DayWorkout, Exercise, ExerciseCompletion } from '../types/workout';
import { useAuth } from '../contexts/AuthContext';
import { saveWorkoutLog } from '../utils/firestore';
import Header from '../components/Header';

const TestWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [workout, setWorkout] = useState<DayWorkout | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSetsData, setCompletedSetsData] = useState<Array<{ completed: boolean; reps?: number; duration?: number }>>([]); // Track each set's data
  const [workoutStartTime] = useState<Date>(new Date());
  const [exerciseData, setExerciseData] = useState<Map<string, ExerciseCompletion>>(new Map());
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const weekNumber = parseInt(searchParams.get('week') || '1');
  const dayNumber = parseInt(searchParams.get('day') || '1');

  useEffect(() => {
    const loadedWorkout = getWorkoutByWeekAndDay(weekNumber, dayNumber);
    setWorkout(loadedWorkout);
    
    if (loadedWorkout && !loadedWorkout.isRestDay) {
      // Find first non-empty section
      const firstSectionIdx = loadedWorkout.sections.findIndex(s => s.exercises.length > 0);
      setCurrentSectionIndex(firstSectionIdx >= 0 ? firstSectionIdx : 0);
      setCurrentExerciseIndex(0);
    }
  }, [weekNumber, dayNumber]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Initialize reps when exercise changes
  useEffect(() => {
    const currentExercise = workout?.sections[currentSectionIndex]?.exercises[currentExerciseIndex];
    if (currentExercise) {
      setReps(currentExercise.defaultReps || 0);
      setCurrentSet(1);
      setTimer(0);
      setIsTimerActive(false);
      setCompletedSetsData([]); // Reset completed sets data for new exercise
    }
  }, [currentSectionIndex, currentExerciseIndex, workout]);

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (workout.isRestDay) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-4 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Rest Day</h2>
            <p className="text-blue-700 mb-6">{workout.description}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = workout.sections[currentSectionIndex];
  const currentExercise: Exercise | undefined = currentSection?.exercises[currentExerciseIndex];
  const totalExercises = workout.sections.reduce((sum, section) => sum + section.exercises.length, 0);
  const completedExercisesCount = workout.sections
    .slice(0, currentSectionIndex)
    .reduce((sum, section) => sum + section.exercises.length, 0) + currentExerciseIndex;

  const handleNext = async () => {
    const nextExerciseIdx = currentExerciseIndex + 1;
    
    if (nextExerciseIdx < currentSection.exercises.length) {
      setCurrentExerciseIndex(nextExerciseIdx);
    } else {
      // Move to next section
      const nextSectionIdx = currentSectionIndex + 1;
      if (nextSectionIdx < workout.sections.length) {
        setCurrentSectionIndex(nextSectionIdx);
        setCurrentExerciseIndex(0);
      } else {
        // Workout complete - save to database
        if (user) {
          try {
            const workoutEndTime = new Date();
            
            // Build sections with completed exercises
            const completedSections = workout.sections.map(section => ({
              type: section.type,
              exercises: section.exercises
                .filter(ex => completedExercises.has(ex.id))
                .map(ex => exerciseData.get(ex.id)!)
                .filter(Boolean)
            })).filter(section => section.exercises.length > 0);
            
            await saveWorkoutLog(user.uid, {
              programId: 'test-12-week-beginner',
              weekNumber,
              dayNumber,
              startTime: workoutStartTime,
              endTime: workoutEndTime,
              sections: completedSections,
              notes: 'Test Mode Workout',
              rating: 0
            });
            
            alert('Test workout completed and saved! ✅');
          } catch (error) {
            console.error('Failed to save test workout:', error);
            alert('Workout completed but failed to save. Please check your connection.');
          }
        }
        navigate('/dashboard');
      }
    }
  };

  const handlePrevious = () => {
    const prevExerciseIdx = currentExerciseIndex - 1;
    
    if (prevExerciseIdx >= 0) {
      setCurrentExerciseIndex(prevExerciseIdx);
    } else {
      // Move to previous section
      const prevSectionIdx = currentSectionIndex - 1;
      if (prevSectionIdx >= 0) {
        const prevSection = workout.sections[prevSectionIdx];
        setCurrentSectionIndex(prevSectionIdx);
        setCurrentExerciseIndex(prevSection.exercises.length - 1);
      }
    }
  };

  const handleCompleteSet = () => {
    const totalSets = currentExercise?.defaultSets || 3;
    
    // Store the current set's data
    const setData: { completed: boolean; reps?: number; duration?: number } = {
      completed: true
    };
    
    // Only include relevant metric
    if (currentExercise?.mechanic === 'reps') {
      setData.reps = reps;
    } else if (currentExercise?.mechanic === 'timed' || currentExercise?.mechanic === 'hold' || currentExercise?.mechanic === 'failure') {
      setData.duration = timer;
    }
    
    // Add this set's data to the array
    const updatedSetsData = [...completedSetsData, setData];
    setCompletedSetsData(updatedSetsData);
    
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      setTimer(0);
      setIsTimerActive(false);
    } else {
      // All sets complete for this exercise - save the data
      if (currentExercise) {
        const exerciseCompletion: ExerciseCompletion = {
          exerciseId: currentExercise.id,
          mechanic: currentExercise.mechanic,
          sets: updatedSetsData // Use the tracked set data
        };
        
        setExerciseData(prev => new Map(prev).set(currentExercise.id, exerciseCompletion));
        setCompletedExercises(prev => new Set(prev).add(currentExercise.id));
      }
      
      handleNext();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Test Mode Banner */}
      <div className="bg-purple-600 text-white py-3 px-4">
        <div className="text-center font-medium">
          🧪 TEST MODE - Week {weekNumber}, Day {dayNumber} ({['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayNumber - 1]})
        </div>
        <div className="text-center text-xs mt-1 opacity-90">
          ✅ This workout will be saved to your progress
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {completedExercisesCount} / {totalExercises}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedExercisesCount / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise List Overview */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Today's Exercises</h3>
          <div className="space-y-3">
            {workout.sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    section.type === 'warmup' ? 'bg-yellow-400' :
                    section.type === 'main' ? 'bg-blue-500' :
                    'bg-purple-400'
                  }`}></span>
                  <h4 className="text-sm font-medium text-gray-700 capitalize">
                    {section.title}
                  </h4>
                </div>
                <div className="ml-4 space-y-1">
                  {section.exercises.map((exercise, exerciseIdx) => {
                    const isCurrentExercise = sectionIdx === currentSectionIndex && exerciseIdx === currentExerciseIndex;
                    const isCompleted = completedExercises.has(exercise.id);
                    
                    return (
                      <div 
                        key={exercise.id}
                        className={`text-sm py-2 px-3 rounded-lg transition-colors ${
                          isCurrentExercise 
                            ? 'bg-purple-100 border-2 border-purple-400 font-medium text-purple-900' 
                            : isCompleted
                            ? 'bg-green-50 text-green-800'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isCompleted && <span className="text-green-600">✓</span>}
                            {isCurrentExercise && <span className="text-purple-600">▶</span>}
                            <span>{exercise.name}</span>
                          </div>
                          <span className="text-xs opacity-75">
                            {exercise.defaultSets} × {exercise.mechanic === 'reps' 
                              ? `${exercise.defaultReps} reps`
                              : `${Math.floor((exercise.defaultDuration || 0) / 60)}:${((exercise.defaultDuration || 0) % 60).toString().padStart(2, '0')}`
                            }
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              currentSection.type === 'warmup' ? 'bg-yellow-400' :
              currentSection.type === 'main' ? 'bg-blue-500' :
              'bg-purple-400'
            }`}></span>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {currentSection.title}
            </h2>
          </div>
        </div>

        {/* Exercise Card */}
        {currentExercise && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            {/* Exercise Name with Color-Coded Circle */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                currentSection.type === 'warmup' ? 'bg-yellow-400' :
                currentSection.type === 'main' ? 'bg-blue-500' :
                'bg-purple-400'
              }`}></span>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentExercise.name}
              </h3>
            </div>
            
            {currentExercise.targetMuscles && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentExercise.targetMuscles.map((muscle: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            )}

            {currentExercise.instructions && currentExercise.instructions.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">{currentExercise.instructions[0]}</p>
              </div>
            )}

            {/* Exercise Controls */}
            <div className="space-y-4">
              {/* Set Counter */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-purple-700 mb-1">Current Set</div>
                  <div className="text-4xl font-bold text-purple-900">
                    {currentSet} / {currentExercise.defaultSets || 3}
                  </div>
                </div>
              </div>

              {/* Reps or Timer */}
              {currentExercise.mechanic === 'reps' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                    className="w-full text-center text-3xl font-bold p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Target: {currentExercise.defaultReps || 10} reps
                  </p>
                </div>
              )}

              {(currentExercise.mechanic === 'timed' || currentExercise.mechanic === 'hold' || currentExercise.mechanic === 'failure') && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <div className="text-5xl font-bold text-green-900 mb-2">
                      {formatTime(timer)}
                    </div>
                    {currentExercise.defaultDuration && (
                      <p className="text-sm text-gray-600">
                        Target: {formatTime(currentExercise.defaultDuration)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isTimerActive
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isTimerActive ? '⏸️ Pause' : '▶️ Start Timer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0 && currentExerciseIndex === 0}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Skip →
          </button>
        </div>

        {/* Exit Test Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Exit Test Mode
        </button>

        {/* Add bottom padding to prevent content from being hidden by sticky button */}
        <div className="h-24"></div>
      </div>

      {/* Sticky Complete Set Button at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={handleCompleteSet}
            className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-md text-lg"
          >
            ✓ Complete Set {currentSet}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestWorkout;
