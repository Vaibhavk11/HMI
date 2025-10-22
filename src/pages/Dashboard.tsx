import React, { useState, useEffect } from 'react';
import { useWorkout } from '../contexts/WorkoutContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Link, useNavigate } from 'react-router-dom';
import { getWorkoutByWeekAndDay } from '../data/workoutProgram';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { todaysWorkout, startWorkout, loading, error, currentWeek, setCurrentWeek, userProgress, isTodayCompleted, resetTodaysWorkout } = useWorkout();
  const [isResetting, setIsResetting] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testDayNumber, setTestDayNumber] = useState(1);
  const [testModeEnabled, setTestModeEnabled] = useState(false);

  // Load test mode preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('testModeEnabled');
    setTestModeEnabled(savedPreference === 'true');
  }, []);
  
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset today\'s workout? This will delete all workout logs for today and allow you to start fresh.')) {
      return;
    }
    
    setIsResetting(true);
    try {
      await resetTodaysWorkout();
      alert('Workout reset successfully! You can now start again.');
    } catch (err) {
      console.error('Failed to reset workout:', err);
      alert('Failed to reset workout. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        <div className="flex flex-col justify-center items-center" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                💪
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">Loading your workout...</p>
            <p className="text-sm text-gray-600">Preparing your fitness journey</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />
        <div className="max-w-xl mx-auto p-6 mt-12">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-900 mb-3">Oops! Something went wrong</h3>
            <p className="text-red-700 mb-6 leading-relaxed">{error}</p>
            <button 
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              onClick={() => window.location.reload()}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const formatDayName = (dayName: string) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return today === dayName ? `${dayName} (Today)` : dayName;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
      <Header />
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Welcome Hero Section */}
        <header className="mb-6 mt-4">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
                    Welcome back! 👋
                  </h1>
                  {user && (
                    <p className="text-blue-100 text-lg font-medium">
                      {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                    </p>
                  )}
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl active:scale-110 transition-transform duration-300 shadow-xl">
                  💪
                </div>
              </div>
              <p className="text-blue-50 text-base">Let's make today count and crush your fitness goals!</p>
            </div>
          </div>
        </header>
        
        {/* Progress Stats */}
        {userProgress && (
          <section className="mb-6 -mt-4">
            <div className="grid grid-cols-2 gap-3 px-1">
              <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white rounded-3xl p-5 shadow-2xl active:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">🔥</div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold">
                    STREAK
                  </div>
                </div>
                <div className="text-3xl font-extrabold mb-1">{userProgress.streak}</div>
                <div className="text-xs text-orange-50 font-medium tracking-wide">Day Streak</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 text-white rounded-3xl p-5 shadow-2xl active:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">💪</div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold">
                    TOTAL
                  </div>
                </div>
                <div className="text-3xl font-extrabold mb-1">
                  {userProgress.completedWorkouts.length}
                </div>
                <div className="text-xs text-purple-50 font-medium tracking-wide">Workouts Done</div>
              </div>
            </div>
          </section>
        )}
        
        {/* Week Selector */}
        <section className="mb-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📅</span>
              Program Progress
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
              12-Week
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className={`px-4 py-3 rounded-xl font-bold transition-all duration-200 min-h-[48px] min-w-[64px] text-sm ${
                currentWeek === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white active:bg-blue-600 active:scale-95 shadow-lg'
              }`}
            >
              ← Prev
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-extrabold text-blue-600 mb-0.5">Week {currentWeek}</div>
              <div className="text-xs text-gray-500 font-medium">of 12 weeks</div>
            </div>
            <button
              onClick={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
              disabled={currentWeek === 12}
              className={`px-4 py-3 rounded-xl font-bold transition-all duration-200 min-h-[48px] min-w-[64px] text-sm ${
                currentWeek === 12
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white active:bg-blue-600 active:scale-95 shadow-lg'
              }`}
            >
              Next →
            </button>
          </div>
          <div className="relative w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(currentWeek / 12) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20"></div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 px-0.5">
            <span>Start</span>
            <span className="font-bold text-blue-600">{Math.round((currentWeek / 12) * 100)}%</span>
            <span>Finish</span>
          </div>
        </section>
        
        {/* Test Mode Toggle - Only show if enabled in settings */}
        {testModeEnabled && (
          <section className="mb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 border-2 border-purple-200 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                  <span className="text-2xl">🧪</span>
                  Testing Mode
                </h2>
                <p className="text-sm text-purple-700 mt-1">Test any day's workout - saves to progress</p>
              </div>
              <button
                onClick={() => setIsTestMode(!isTestMode)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 shadow-lg ${
                  isTestMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                    isTestMode ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          
          {isTestMode && (
            <div className="mt-5 space-y-4">
              <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-lg">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-lg">📆</span>
                  Select Day to Test
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <button
                      key={day}
                      onClick={() => setTestDayNumber(idx + 1)}
                      className={`py-3 px-2 text-xs font-bold rounded-xl transition-all duration-200 transform ${
                        testDayNumber === idx + 1
                          ? 'bg-purple-600 text-white shadow-lg scale-110'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Exercise Preview for Selected Test Day */}
              {(() => {
                const testWorkout = getWorkoutByWeekAndDay(currentWeek, testDayNumber);
                if (!testWorkout) return null;
                
                if (testWorkout.isRestDay) {
                  return (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">😴</span>
                        <p className="text-blue-800 font-medium">Rest Day</p>
                        <p className="text-blue-600 text-sm mt-1">{testWorkout.description}</p>
                      </div>
                    </div>
                  );
                }
                
                const totalExercises = testWorkout.sections.reduce((sum, section) => sum + section.exercises.length, 0);
                
                return (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Exercises Preview</h4>
                      <span className="text-xs text-purple-600 font-medium">
                        {totalExercises} exercises
                      </span>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {testWorkout.sections.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              section.type === 'warmup' ? 'bg-yellow-400' :
                              section.type === 'main' ? 'bg-blue-500' :
                              'bg-purple-400'
                            }`}></span>
                            <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              {section.title}
                            </h5>
                          </div>
                          <div className="ml-4 space-y-1">
                            {section.exercises.map((exercise) => (
                              <div 
                                key={exercise.id}
                                className="text-sm py-2 px-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700">{exercise.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {exercise.defaultSets} × {exercise.mechanic === 'reps' 
                                      ? `${exercise.defaultReps} reps`
                                      : `${Math.floor((exercise.defaultDuration || 0) / 60)}:${((exercise.defaultDuration || 0) % 60).toString().padStart(2, '0')}`
                                    }
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              
              <button
                onClick={() => {
                  // Navigate to test workout
                  navigate(`/workout/test?week=${currentWeek}&day=${testDayNumber}`);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center text-lg"
              >
                <span className="text-2xl mr-3">🧪</span>
                Test Week {currentWeek} - {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][testDayNumber - 1]}
              </button>
            </div>
          )}
          </section>
        )}
        
        {/* Today's Workout Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            {todaysWorkout ? formatDayName(todaysWorkout.dayName) : 'Today\'s Workout'}
          </h2>
          
          {todaysWorkout ? (
            todaysWorkout.isRestDay ? (
              <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8 text-center shadow-xl">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-200 rounded-full mb-5 animate-pulse">
                  <span className="text-5xl">😴</span>
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-3">Rest Day</h3>
                <p className="text-blue-700 text-lg mb-6 font-medium">{todaysWorkout.description}</p>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 inline-block max-w-md border border-blue-200">
                  <p className="text-blue-900 font-semibold text-base mb-3">
                    Enjoy your rest day! Your muscles need time to recover and grow stronger.
                  </p>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Stay hydrated 💧, stretch gently 🧘, and get adequate sleep 😴
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{todaysWorkout.description}</h3>
                    <p className="text-base text-gray-600 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <span>💪</span>
                        {todaysWorkout.sections.filter(s => s.type === 'main').reduce((acc, s) => acc + s.exercises.length, 0)} exercises
                      </span>
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                    ✓ Active
                  </div>
                </div>
                
                {todaysWorkout.sections.map((section, i) => (
                  <div key={i} className="mb-5">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center text-base">
                      <span className={`inline-block w-3 h-3 rounded-full mr-3 shadow-md ${
                        section.type === 'warmup' ? 'bg-yellow-400' :
                        section.type === 'main' ? 'bg-blue-500' :
                        'bg-purple-400'
                      }`}></span>
                      {section.title}
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 ml-6 space-y-2">
                      {section.type === 'main' && section.exercises.map((exercise, j) => (
                        <li key={j} className="text-sm leading-relaxed">
                          <span className="font-medium">{exercise.name}</span>
                          {exercise.mechanic === 'reps' && exercise.defaultReps && exercise.defaultSets && (
                            <span className="text-gray-600"> — {exercise.defaultReps} reps × {exercise.defaultSets} sets</span>
                          )}
                          {exercise.mechanic === 'timed' && exercise.defaultDuration && (
                            <span className="text-gray-600"> — {Math.floor(exercise.defaultDuration / 60)} min</span>
                          )}
                          {exercise.mechanic === 'failure' && (
                            <span className="text-gray-600"> — until failure</span>
                          )}
                        </li>
                      ))}
                      {(section.type === 'warmup' || section.type === 'cooldown') && (
                        <li className="text-sm text-gray-600 italic">{section.exercises.length} exercises included</li>
                      )}
                    </ul>
                  </div>
                ))}
                
                <div className="mt-8 space-y-4">
                  {isTodayCompleted ? (
                    <>
                      <div className="w-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center shadow-xl">
                        <span className="text-3xl mr-3 animate-bounce">✓</span>
                        <span className="text-lg">Workout Completed Today!</span>
                      </div>
                      <button
                        onClick={handleReset}
                        disabled={isResetting}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-orange-300 disabled:to-red-300 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center text-base"
                      >
                        {isResetting ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Resetting...
                          </>
                        ) : (
                          <>
                            <span className="text-2xl mr-3">🔄</span>
                            Reset Today's Workout
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startWorkout}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-200 active:scale-95 shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center text-lg min-h-[60px]"
                    >
                      <span className="text-2xl mr-3">▶</span>
                      Start Workout Now
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-8 text-center shadow-lg">
              <span className="text-5xl mb-4 block">🤷</span>
              <p className="text-gray-700 font-semibold text-lg">No workout scheduled for today.</p>
            </div>
          )}
        </section>
        
        {/* Quick Links */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 px-1">
            <span className="text-2xl">⚡</span>
            Quick Access
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/notes"
              className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-2xl p-5 shadow-xl active:shadow-2xl transition-all duration-300 active:scale-95 text-center min-h-[140px] flex flex-col items-center justify-center"
            >
              <div className="text-4xl mb-2">📝</div>
              <div className="font-bold text-base mb-1">Notes</div>
              <div className="text-xs text-yellow-50 font-medium">Track progress</div>
            </Link>
            <Link
              to="/progress"
              className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl p-5 shadow-xl active:shadow-2xl transition-all duration-300 active:scale-95 text-center min-h-[140px] flex flex-col items-center justify-center"
            >
              <div className="text-4xl mb-2">📊</div>
              <div className="font-bold text-base mb-1">Progress</div>
              <div className="text-xs text-emerald-50 font-medium">View stats</div>
            </Link>
          </div>
        </section>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Dashboard;
