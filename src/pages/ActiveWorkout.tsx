import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../contexts/WorkoutContext';
import { voiceService } from '../utils/voiceService';
import { voiceCommandService } from '../utils/voiceCommandService';
import VoiceSettingsModal from '../components/VoiceSettingsModal';

const ActiveWorkout: React.FC = () => {
  const navigate = useNavigate();
  const {
    isWorkoutActive,
    currentSection,
    currentExercise,
    currentExerciseIndex,
    currentSectionIndex,
    todaysWorkout,
    workoutStartTime,
    completeExercise,
    skipExercise,
    previousExercise
  } = useWorkout();
  
  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [reps, setReps] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [completedSets, setCompletedSets] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [restTimer, setRestTimer] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [voiceCommandsActive, setVoiceCommandsActive] = useState<boolean>(false);
  
  // Redirect if workout isn't active
  useEffect(() => {
    if (!isWorkoutActive) {
      navigate('/dashboard');
    }
  }, [isWorkoutActive, navigate]);
  
  // Initialize reps when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setReps(currentExercise.defaultReps || 0);
      setCurrentSet(1);
      setCompletedSets(0);
      setTimer(0);
      setIsTimerActive(false);
      setIsResting(false);
      setRestTimer(0);
      
      // Announce new exercise start
      voiceService.announceExerciseStart(currentExercise.name, 1);
    }
  }, [currentExercise]);
  
  // Timer for timed exercises
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive]);
  
  // Track total workout elapsed time
  useEffect(() => {
    if (!workoutStartTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [workoutStartTime]);
  
  // Rest timer countdown
  useEffect(() => {
    if (!isResting || restTimer <= 0) return;
    
    const interval = setInterval(() => {
      setRestTimer(prev => {
        const newTime = prev - 1;
        
        // Voice announcements at specific intervals
        if (newTime === 10) {
          voiceService.announceRestEnding(10);
        } else if (newTime === 5) {
          voiceService.announceRestEnding(5);
        } else if (newTime === 3) {
          voiceService.announceRestEnding(3);
        } else if (newTime === 0) {
          setIsResting(false);
          if (currentExercise) {
            voiceService.announceExerciseStart(currentExercise.name, currentSet);
          }
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isResting, restTimer, currentExercise, currentSet]);
  
  // Define handleCompleteSet with useCallback
  const handleCompleteSet = useCallback(() => {
    if (!currentExercise) return;
    
    const totalSets = currentExercise.defaultSets || 1;
    
    if (currentSet < totalSets) {
      // Announce set completion
      voiceService.announceSetComplete(currentSet, totalSets);
      
      // Move to next set
      setCompletedSets(currentSet);
      setCurrentSet(currentSet + 1);
      setTimer(0);
      setIsTimerActive(false);
      
      // Start rest timer if rest period is defined
      if (currentExercise.restBetweenSets) {
        setIsResting(true);
        setRestTimer(currentExercise.restBetweenSets);
        voiceService.announceRestStart(currentExercise.restBetweenSets);
      } else {
        // Announce next set immediately if no rest
        voiceService.announceExerciseStart(currentExercise.name, currentSet + 1);
      }
    } else {
      // Announce exercise completion
      voiceService.announceExerciseComplete(currentExercise.name);
      
      // All sets complete, move to next exercise
      completeExercise(currentExercise.id, {
        reps: currentExercise.mechanic === 'reps' ? reps : undefined,
        duration: currentExercise.mechanic === 'timed' || currentExercise.mechanic === 'hold' ? timer : undefined,
        sets: totalSets
      });
    }
  }, [currentExercise, currentSet, reps, timer, completeExercise]);
  
  // Auto-complete timed exercises
  useEffect(() => {
    if (
      currentExercise &&
      currentExercise.mechanic === 'timed' &&
      currentExercise.defaultDuration &&
      timer >= currentExercise.defaultDuration &&
      isTimerActive
    ) {
      setIsTimerActive(false);
      handleCompleteSet();
    }
  }, [timer, currentExercise, isTimerActive, handleCompleteSet]);
  
  // Setup voice commands
  useEffect(() => {
    // Check if voice commands are enabled
    const commandSettings = voiceCommandService.getSettings();
    setVoiceCommandsActive(commandSettings.enabled && voiceCommandService.isSupported());
    
    // Register command handlers
    voiceCommandService.registerCommand('next', handleCompleteSet);
    voiceCommandService.registerCommand('skip', skipExercise);
    voiceCommandService.registerCommand('pause', () => {
      if (isTimerActive) {
        setIsTimerActive(false);
        voiceService.speak('Timer paused');
      }
    });
    voiceCommandService.registerCommand('resume', () => {
      if (!isTimerActive && !isResting) {
        setIsTimerActive(true);
        voiceService.speak('Timer resumed');
      }
    });
    voiceCommandService.registerCommand('start', () => {
      if (!isTimerActive && !isResting) {
        setIsTimerActive(true);
        voiceService.speak('Timer started');
      }
    });
    voiceCommandService.registerCommand('complete', handleCompleteSet);
    voiceCommandService.registerCommand('instructions', () => {
      setShowInstructions(true);
      voiceService.speak('Showing instructions');
    });
    
    // Start listening for commands
    voiceCommandService.startListening();
    
    // Cleanup on unmount
    return () => {
      voiceCommandService.stopListening();
      voiceCommandService.clearCommands();
    };
  }, [handleCompleteSet, skipExercise, isTimerActive, isResting]);
  
  // Monitor voice command status
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const commandSettings = voiceCommandService.getSettings();
      const isActive = commandSettings.enabled && voiceCommandService.getIsListening();
      setVoiceCommandsActive(isActive);
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, []);
  
  if (!currentSection || !currentExercise || !todaysWorkout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exercise...</p>
        </div>
      </div>
    );
  }
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const totalExercises = todaysWorkout.sections.reduce((acc, section) => acc + section.exercises.length, 0);
  const completedExercises = todaysWorkout.sections.reduce((acc, section, idx) => {
    if (idx < currentSectionIndex) return acc + section.exercises.length;
    if (idx === currentSectionIndex) return acc + currentExerciseIndex;
    return acc;
  }, 0);
  const progressPercent = (completedExercises / totalExercises) * 100;
  
  const canGoBack = currentSectionIndex > 0 || currentExerciseIndex > 0;
  const totalSets = currentExercise.defaultSets || 1;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with progress */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{currentSection.title}</h1>
              <p className="text-sm text-gray-500">
                Exercise {completedExercises + 1} of {totalExercises}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {voiceCommandsActive && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                  </div>
                  <span>🎤 Voice Active</span>
                </div>
              )}
              <button
                onClick={() => setShowVoiceSettings(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                title="Voice Settings"
              >
                🎙️
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">{formatTime(elapsedTime)}</div>
                <div className="text-xs text-gray-500">Total Time</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Exercise Content */}
      <div className="max-w-xl mx-auto p-4">
        {/* Voice Commands Tip for "To Failure" Exercises */}
        {voiceCommandsActive && currentExercise.mechanic === 'failure' && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4 text-center">
            <div className="text-blue-800 font-semibold text-sm mb-1">💡 Voice Command Tip</div>
            <div className="text-blue-700 text-xs">
              Say <strong>"Complete"</strong> or <strong>"Done"</strong> when you reach failure
            </div>
          </div>
        )}
        
        {/* Rest Timer Banner */}
        {isResting && restTimer > 0 && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-4 text-center animate-pulse">
            <div className="text-yellow-800 font-bold text-lg mb-1">⏸️ Rest Period</div>
            <div className="text-4xl font-bold text-yellow-600 mb-1">{restTimer}s</div>
            <div className="text-sm text-yellow-700">
              Prepare for set {currentSet}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          {/* Exercise Name */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            {currentExercise.name}
          </h2>
          
          {/* Exercise Image/GIF */}
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden" style={{ height: '240px' }}>
            {currentExercise.imageUrl || currentExercise.videoUrl ? (
              <div className="w-full h-full">
                {currentExercise.videoUrl ? (
                  <video
                    src={currentExercise.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : currentExercise.imageUrl ? (
                  <img
                    src={currentExercise.imageUrl}
                    alt={currentExercise.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-gray-400">
                            <div class="text-center">
                              <div class="text-6xl mb-2">🏋️</div>
                              <p class="text-sm">Exercise demonstration</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : null}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">🏋️</div>
                  <p className="text-sm">Exercise demonstration</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Instructions Toggle */}
          {currentExercise.instructions && currentExercise.instructions.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              >
                <span className="font-medium">📋 Exercise Instructions</span>
                <span className="text-xl">
                  {showInstructions ? '▲' : '▼'}
                </span>
              </button>
              
              {showInstructions && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    {currentExercise.instructions.map((instruction, idx) => (
                      <li key={idx} className="leading-relaxed">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
          
          {/* Set Counter */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Current Set</div>
            <div className="text-3xl font-bold text-blue-600">
              {currentSet} / {totalSets}
            </div>
            {completedSets > 0 && (
              <div className="text-sm text-green-600 mt-1">
                ✓ {completedSets} set{completedSets > 1 ? 's' : ''} completed
              </div>
            )}
          </div>
          
          {/* Exercise Controls based on mechanic */}
          {currentExercise.mechanic === 'reps' && (
            <div className="mb-4">
              <label className="block text-center text-gray-700 font-medium mb-2">
                Reps
              </label>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setReps(Math.max(1, reps - 1))}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-12 h-12 rounded-full text-xl font-bold"
                >
                  −
                </button>
                <div className="bg-white border-2 border-blue-500 w-20 h-20 rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">{reps}</span>
                </div>
                <button 
                  onClick={() => setReps(reps + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-12 h-12 rounded-full text-xl font-bold"
                >
                  +
                </button>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                Target: {currentExercise.defaultReps} reps
              </div>
            </div>
          )}
          
          {(currentExercise.mechanic === 'timed' || currentExercise.mechanic === 'hold' || currentExercise.mechanic === 'failure') && (
            <div className="mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  {formatTime(timer)}
                </div>
                <div className="flex justify-center gap-3 mb-3">
                  <button 
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      isTimerActive 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isTimerActive ? '⏸ Pause' : '▶ Start'}
                  </button>
                  <button 
                    onClick={() => { setTimer(0); setIsTimerActive(false); }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium"
                  >
                    ↺ Reset
                  </button>
                </div>
                {currentExercise.defaultDuration && (
                  <div className="text-sm text-gray-600">
                    Target: {formatTime(currentExercise.defaultDuration)}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Complete Set Button */}
          <button 
            onClick={handleCompleteSet}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
          >
            {currentSet < totalSets ? `Complete Set ${currentSet}` : '✓ Complete Exercise'}
          </button>
          
          {/* Rest Timer between sets */}
          {completedSets > 0 && completedSets < totalSets && currentExercise.restBetweenSets && (
            <div className="text-center text-sm text-gray-600 mb-3">
              Rest {currentExercise.restBetweenSets}s before next set
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={previousExercise}
            disabled={!canGoBack}
            className={`flex-1 py-3 px-4 rounded-lg font-medium ${
              !canGoBack
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
            }`}
          >
            ← Previous
          </button>
          <button 
            onClick={skipExercise}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg font-medium"
          >
            Skip →
          </button>
        </div>
      </div>
      
      {/* Voice Settings Modal */}
      <VoiceSettingsModal 
        isOpen={showVoiceSettings} 
        onClose={() => setShowVoiceSettings(false)} 
      />
    </div>
  );
};

export default ActiveWorkout;
