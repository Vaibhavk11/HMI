import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWorkoutLogs, getUserProgress } from '../utils/firestore';
import { WorkoutLog, UserProgress } from '../types/workout';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'history' | 'stats'>('overview');
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [logs, progress] = await Promise.all([
          fetchWorkoutLogs(user.uid),
          getUserProgress(user.uid)
        ]);
        setWorkoutLogs(logs);
        setUserProgress(progress);
      } catch (error) {
        console.error('Failed to load progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [user]);

  // Calculate statistics
  const stats = {
    totalWorkouts: workoutLogs.length,
    totalMinutes: workoutLogs.reduce((sum, log) => {
      console.log('📊 Processing workout log:', {
        id: log.id,
        hasStartTime: !!log.startTime,
        hasEndTime: !!log.endTime,
        startTime: log.startTime?.toISOString(),
        endTime: log.endTime?.toISOString(),
      });
      
      if (log.startTime && log.endTime) {
        const duration = (log.endTime.getTime() - log.startTime.getTime()) / (1000 * 60);
        console.log('⏱️ Calculated duration:', duration, 'minutes');
        
        // Only count positive durations
        if (duration > 0) {
          return sum + duration;
        } else {
          console.warn('⚠️ Invalid duration (<=0):', duration);
        }
      } else {
        console.warn('⚠️ Missing time data:', { startTime: log.startTime, endTime: log.endTime });
      }
      return sum;
    }, 0),
    averageRating: workoutLogs.length > 0
      ? workoutLogs.reduce((sum, log) => sum + (log.notes ? 3 : 3), 0) / workoutLogs.length
      : 0,
    currentStreak: userProgress?.streak || 0,
    longestStreak: userProgress?.longestStreak || 0,
  };
  
  console.log('📈 Total stats calculated:', {
    totalWorkouts: stats.totalWorkouts,
    totalMinutes: stats.totalMinutes
  });

  // Group workouts by week
  const workoutsByWeek = workoutLogs.reduce((acc, log) => {
    const week = log.weekNumber;
    if (!acc[week]) acc[week] = [];
    acc[week].push(log);
    return acc;
  }, {} as Record<number, WorkoutLog[]>);

  // Get recent workouts (last 7)
  const recentWorkouts = [...workoutLogs].slice(0, 7);

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get day name
  const getDayName = (dayNumber: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber % 7];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your progress</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-blue-100">Week {userProgress?.currentWeek || 1} of 12</p>
      </div>

      {/* View Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              selectedView === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('history')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              selectedView === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setSelectedView('stats')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              selectedView === 'stats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Overview View */}
        {selectedView === 'overview' && (
          <div className="space-y-4">
            {/* Streak Card */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-orange-100 text-sm">Current Streak</p>
                  <p className="text-4xl font-bold">{stats.currentStreak} days</p>
                </div>
                <div className="text-6xl">🔥</div>
              </div>
              <p className="text-orange-100 text-sm mt-2">
                Longest: {stats.longestStreak} days
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Total Workouts</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</div>
                <div className="text-xs text-gray-400 mt-1">All time</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Total Time</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatDuration(stats.totalMinutes)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Exercising</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Current Week</div>
                <div className="text-2xl font-bold text-gray-900">
                  Week {userProgress?.currentWeek || 1}
                </div>
                <div className="text-xs text-gray-400 mt-1">of 12 weeks</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm mb-1">Completion</div>
                <div className="text-2xl font-bold text-gray-900">
                  {userProgress?.currentWeek ? Math.round((userProgress.currentWeek / 12) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-400 mt-1">Program</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-3">Recent Activity</h2>
              {recentWorkouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No workouts yet</p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start your first workout →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentWorkouts.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Week {log.weekNumber} - {getDayName(log.dayNumber)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(log.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {log.startTime && log.endTime
                            ? formatDuration((log.endTime.getTime() - log.startTime.getTime()) / (1000 * 60))
                            : '-'}
                        </div>
                        <div className="text-xs text-gray-500">✓ Complete</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">Program Progress</h2>
                <span className="text-sm text-gray-600">
                  {userProgress?.currentWeek || 0}/12 weeks
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${((userProgress?.currentWeek || 0) / 12) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {selectedView === 'history' && (
          <div className="space-y-4">
            {workoutLogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-4">No workout history yet</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Start your first workout →
                </button>
              </div>
            ) : (
              Object.keys(workoutsByWeek)
                .sort((a, b) => Number(b) - Number(a))
                .map((week) => (
                  <div key={week} className="bg-white rounded-lg shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Week {week}</h3>
                    <div className="space-y-2">
                      {workoutsByWeek[Number(week)]
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((log) => (
                          <div
                            key={log.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {getDayName(log.dayNumber)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {log.date.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                              <span className="text-green-600 text-sm font-medium">
                                ✓ Completed
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                ⏱️ {log.startTime && log.endTime
                                  ? formatDuration((log.endTime.getTime() - log.startTime.getTime()) / (1000 * 60))
                                  : '-'}
                              </span>
                              <span>
                                💪 {log.sections.reduce((sum, section) => sum + section.exercises.length, 0)} exercises
                              </span>
                            </div>
                            
                            {log.notes && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-sm text-gray-600 italic">"{log.notes}"</p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Statistics View */}
        {selectedView === 'stats' && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Overall Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Workouts</span>
                  <span className="font-semibold text-gray-900">{stats.totalWorkouts}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Time Exercising</span>
                  <span className="font-semibold text-gray-900">{formatDuration(stats.totalMinutes)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Average Per Workout</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalWorkouts > 0 ? formatDuration(stats.totalMinutes / stats.totalWorkouts) : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold text-gray-900">{stats.currentStreak} days 🔥</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Longest Streak</span>
                  <span className="font-semibold text-gray-900">{stats.longestStreak} days 🏆</span>
                </div>
              </div>
            </div>

            {/* Weekly Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Weekly Breakdown</h2>
              <div className="space-y-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => {
                  const weekWorkouts = workoutsByWeek[week] || [];
                  const completionRate = (weekWorkouts.length / 6) * 100; // 6 workout days per week
                  const isExpanded = expandedWeeks.has(week);
                  
                  // Get workouts by day for this week
                  const workoutsByDay: { [key: number]: WorkoutLog[] } = {};
                  weekWorkouts.forEach(workout => {
                    if (!workoutsByDay[workout.dayNumber]) {
                      workoutsByDay[workout.dayNumber] = [];
                    }
                    workoutsByDay[workout.dayNumber].push(workout);
                  });
                  
                  const toggleWeek = () => {
                    const newExpanded = new Set(expandedWeeks);
                    if (isExpanded) {
                      newExpanded.delete(week);
                    } else {
                      newExpanded.add(week);
                    }
                    setExpandedWeeks(newExpanded);
                  };
                  
                  return (
                    <div key={week} className="border border-gray-200 rounded-lg p-3">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={toggleWeek}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">Week {week}</span>
                            <span className="text-gray-900 font-medium">
                              {weekWorkouts.length}/6 workouts
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                completionRate === 100
                                  ? 'bg-green-500'
                                  : completionRate > 0
                                  ? 'bg-blue-500'
                                  : 'bg-gray-200'
                              }`}
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-3 text-gray-400">
                          {isExpanded ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Day-wise Details */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          {[1, 2, 3, 4, 5, 6, 7].map(day => {
                            const dayWorkouts = workoutsByDay[day] || [];
                            const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1];
                            const isRestDay = day === 7;
                            
                            return (
                              <div key={day} className="flex items-center justify-between text-xs py-1">
                                <div className="flex items-center gap-2">
                                  <span className={`w-12 font-medium ${dayWorkouts.length > 0 ? 'text-green-600' : isRestDay ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {dayName}
                                  </span>
                                  <span className="text-gray-600">Day {day}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isRestDay ? (
                                    <span className="text-blue-600 text-xs">Rest Day 😴</span>
                                  ) : dayWorkouts.length > 0 ? (
                                    <>
                                      <span className="text-green-600 font-medium">✓ Completed</span>
                                      {dayWorkouts[0].endTime && dayWorkouts[0].startTime && (
                                        <span className="text-gray-500">
                                          ({Math.round((dayWorkouts[0].endTime.getTime() - dayWorkouts[0].startTime.getTime()) / 60000)}m)
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-400">Not done</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Achievements</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border-2 ${stats.totalWorkouts >= 1 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-xs font-medium text-gray-700">First Workout</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${stats.currentStreak >= 3 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-xs font-medium text-gray-700">3 Day Streak</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${stats.totalWorkouts >= 10 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-xs font-medium text-gray-700">10 Workouts</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${stats.currentStreak >= 7 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-xs font-medium text-gray-700">Week Streak</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Progress;
