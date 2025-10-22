import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { deleteAllWorkoutData } from '../utils/firestore';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testModeEnabled, setTestModeEnabled] = useState(false);

  // Load test mode preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('testModeEnabled');
    setTestModeEnabled(savedPreference === 'true');
  }, []);

  // Save test mode preference to localStorage
  const handleTestModeToggle = () => {
    const newValue = !testModeEnabled;
    setTestModeEnabled(newValue);
    localStorage.setItem('testModeEnabled', String(newValue));
  };

  const handleDeleteAllData = async () => {
    if (!user) return;
    
    // Double confirmation
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      setIsDeleting(true);
      await deleteAllWorkoutData(user.uid);
      setShowDeleteConfirm(false);
      alert('✅ All workout data has been deleted and progress reset!');
      // Refresh the page to update UI
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete workout data:', error);
      alert('❌ Failed to delete workout data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto p-4 mb-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-4">Settings</h1>

        {/* Account Section */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
          
          {user && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              {user.displayName && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Display Name</label>
                  <p className="text-gray-900">{user.displayName}</p>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </section>

        {/* Preferences Section */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
          
          <div className="space-y-4">
            {/* Test Mode Toggle */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">🧪 Enable Test Mode</div>
                <p className="text-sm text-gray-600">
                  Show test mode option on dashboard to practice any day's workout. Test workouts are saved to your progress.
                </p>
              </div>
              <button
                onClick={handleTestModeToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ml-4 flex-shrink-0 ${
                  testModeEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    testModeEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {testModeEnabled && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>✓ Test Mode is enabled</strong><br/>
                  You can now access test mode from the dashboard to try any workout day. All test workouts will be saved to your progress just like regular workouts.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Data Management Section */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-900 mb-2">⚠️ Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              This action will permanently delete all your workout logs, progress, and reset your streak. This cannot be undone!
            </p>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                🗑️ Delete All Workout Data
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <p className="text-red-900 font-semibold text-center mb-2">
                    Are you absolutely sure?
                  </p>
                  <p className="text-sm text-red-800 text-center">
                    This will delete all workout logs and reset your progress to Week 1, Day 1.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAllData}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Yes, Delete Everything'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>What will be deleted:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>All workout logs and history</li>
              <li>Current week progress</li>
              <li>Streak data (current and longest)</li>
              <li>All exercise completion records</li>
            </ul>
            <p className="mt-3"><strong>What will be preserved:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Your account and login credentials</li>
              <li>Personal notes (if any)</li>
              <li>App settings and preferences</li>
            </ul>
          </div>
        </section>

        {/* App Information */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">App Information</h2>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Program</span>
              <span className="font-medium text-gray-900">12-Week Beginner</span>
            </div>
            <div className="flex justify-between">
              <span>Features</span>
              <span className="font-medium text-gray-900">Voice Commands, Test Mode</span>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Help & Support</h2>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">📖 How to Use</div>
              <div className="text-sm text-gray-600">Learn about app features</div>
            </button>
            
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">🎤 Voice Commands</div>
              <div className="text-sm text-gray-600">View available voice commands</div>
            </button>
            
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">🧪 Test Mode</div>
              <div className="text-sm text-gray-600">Learn about testing workouts</div>
            </button>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
