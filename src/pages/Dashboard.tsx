import React from 'react';
import { useWorkout } from '../contexts/WorkoutContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { todaysWorkout, startWorkout, loading, error, currentWeek, setCurrentWeek } = useWorkout();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your workout...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-xl mx-auto p-4 mt-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              className="mt-2 text-sm text-red-600 underline"
              onClick={() => window.location.reload()}
            >
              Try again
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        {/* Welcome Section */}
        <header className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout Dashboard
          </h1>
          {user && (
            <p className="text-gray-600">Welcome back, {user.displayName || user.email?.split('@')[0]}! 💪</p>
          )}
        </header>
        
        {/* Week Selector */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Program Progress</h2>
            <span className="text-sm text-gray-500">12-Week Beginner Program</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek === 1}
              className={`px-3 py-2 rounded-lg ${
                currentWeek === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              ← Prev
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-blue-600">Week {currentWeek}</div>
              <div className="text-sm text-gray-500">of 12</div>
            </div>
            <button
              onClick={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
              disabled={currentWeek === 12}
              className={`px-3 py-2 rounded-lg ${
                currentWeek === 12
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Next →
            </button>
          </div>
          <div className="mt-3 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentWeek / 12) * 100}%` }}
            ></div>
          </div>
        </section>
        
        {/* Today's Workout Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {todaysWorkout ? formatDayName(todaysWorkout.dayName) : 'Today\'s Workout'}
          </h2>
          
          {todaysWorkout ? (
            todaysWorkout.isRestDay ? (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-3xl">😴</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">Rest Day</h3>
                <p className="text-blue-600 mb-4">{todaysWorkout.description}</p>
                <div className="bg-blue-100 rounded-lg p-4 inline-block max-w-md">
                  <p className="text-blue-800 font-medium">
                    Enjoy your rest day! Your muscles need time to recover and grow stronger.
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    Stay hydrated, stretch gently, and get adequate sleep.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{todaysWorkout.description}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {todaysWorkout.sections.filter(s => s.type === 'main').reduce((acc, s) => acc + s.exercises.length, 0)} exercises
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </div>
                </div>
                
                {todaysWorkout.sections.map((section, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        section.type === 'warmup' ? 'bg-yellow-400' :
                        section.type === 'main' ? 'bg-blue-500' :
                        'bg-purple-400'
                      }`}></span>
                      {section.title}
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                      {section.type === 'main' && section.exercises.map((exercise, j) => (
                        <li key={j} className="text-sm">
                          {exercise.name}
                          {exercise.mechanic === 'reps' && exercise.defaultReps && exercise.defaultSets && (
                            <span className="text-gray-500"> — {exercise.defaultReps} reps × {exercise.defaultSets} sets</span>
                          )}
                          {exercise.mechanic === 'timed' && exercise.defaultDuration && (
                            <span className="text-gray-500"> — {Math.floor(exercise.defaultDuration / 60)} min</span>
                          )}
                          {exercise.mechanic === 'failure' && (
                            <span className="text-gray-500"> — until failure</span>
                          )}
                        </li>
                      ))}
                      {(section.type === 'warmup' || section.type === 'cooldown') && (
                        <li className="text-sm text-gray-500 italic">{section.exercises.length} exercises included</li>
                      )}
                    </ul>
                  </div>
                ))}
                
                <div className="mt-6">
                  <button
                    onClick={startWorkout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <span className="text-xl mr-2">▶</span>
                    Start Workout
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <p className="text-gray-600 mb-3">No workout scheduled for today.</p>
            </div>
          )}
        </section>
        
        {/* Quick Links */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/notes"
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📝</div>
              <div className="font-medium text-gray-800">Notes</div>
              <div className="text-sm text-gray-500">Track your progress</div>
            </Link>
            <Link
              to="/progress"
              className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-medium text-gray-800">Progress</div>
              <div className="text-sm text-gray-500">View statistics</div>
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
