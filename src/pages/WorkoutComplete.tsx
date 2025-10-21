import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../contexts/WorkoutContext';

const WorkoutComplete: React.FC = () => {
  const navigate = useNavigate();
  const { completeWorkout, workoutStartTime, todaysWorkout } = useWorkout();
  const [notes, setNotes] = useState<string>('');
  const [rating, setRating] = useState<number>(3);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Calculate workout duration
  const calculateDuration = (): string => {
    if (!workoutStartTime) return '00:00';
    
    const now = new Date();
    const durationMs = now.getTime() - workoutStartTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await completeWorkout(notes, rating);
      // completeWorkout will navigate to dashboard
    } catch (error) {
      console.error('Failed to complete workout:', error);
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Complete!</h1>
            <p className="text-gray-600">Great job! You've completed today's workout. 🎉</p>
          </div>
          
          {/* Workout Summary */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-3">Workout Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Workout:</span>
                <span className="font-semibold">{todaysWorkout?.dayName || 'Today'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{calculateDuration()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold">{todaysWorkout?.description || 'Workout'}</span>
              </div>
            </div>
          </div>
          
          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              How was your workout?
            </label>
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-all ${
                    rating >= star 
                      ? 'text-yellow-500 scale-110' 
                      : 'text-gray-300 hover:text-yellow-400'
                  } focus:outline-none`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2 mt-2">
              <span>Too Easy</span>
              <span>Perfect</span>
              <span>Too Hard</span>
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              Workout Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="How did you feel? Any challenges or achievements?"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Track your progress, note any difficulties, or celebrate your wins!
            </p>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-4 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="text-xl mr-2">✓</span>
                Complete & Save Workout
              </>
            )}
          </button>
          
          {/* Skip Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Skip and return to dashboard
          </button>
        </div>
        
        {/* Motivational Quote */}
        <div className="text-center text-gray-500 text-sm">
          <p className="italic">"The only bad workout is the one that didn't happen."</p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutComplete;
