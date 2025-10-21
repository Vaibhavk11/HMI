import React from 'react';

// Check if Firebase environment variables are configured
const checkFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter((varName) => !import.meta.env[varName]);
  
  return {
    isConfigured: missingVars.length === 0,
    missingVars,
  };
};

const FirebaseStatus: React.FC = () => {
  const { isConfigured, missingVars } = checkFirebaseConfig();

  if (isConfigured) {
    return null; // Don't render anything if Firebase is properly configured
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <svg className="w-10 h-10 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PWA Notes App
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              A Progressive Web App for managing notes with offline support
            </p>
          </div>

          {/* Configuration Warning */}
          <div className="px-8 py-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Firebase Configuration Required
                  </h3>
                  <p className="text-yellow-700 mt-2">
                    This application requires Firebase to be configured before it can be used.
                    The following environment variables are missing:
                  </p>
                  <ul className="mt-3 space-y-1">
                    {missingVars.map((varName) => (
                      <li key={varName} className="text-sm font-mono text-yellow-800">
                        • {varName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                  Set Up Firebase Project
                </h2>
                <div className="ml-11 space-y-2 text-gray-700">
                  <p>Create a new Firebase project:</p>
                  <ol className="list-disc list-inside ml-4 space-y-1">
                    <li>Go to <a href="https://console.firebase.google.com" className="text-blue-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
                    <li>Create a new project or select an existing one</li>
                    <li>Enable <strong>Authentication</strong> → Email/Password sign-in method</li>
                    <li>Create a <strong>Firestore Database</strong> in production mode</li>
                    <li>Get your Firebase configuration from Project Settings</li>
                  </ol>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                  Configure GitHub Secrets
                </h2>
                <div className="ml-11 space-y-2 text-gray-700">
                  <p>Add your Firebase configuration as GitHub Secrets:</p>
                  <ol className="list-disc list-inside ml-4 space-y-1">
                    <li>Go to your repository on GitHub</li>
                    <li>Navigate to <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></li>
                    <li>Add each Firebase configuration value as a new repository secret</li>
                  </ol>
                  <div className="bg-gray-50 p-4 rounded-lg mt-3">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Required Secrets:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">VITE_FIREBASE_API_KEY</div>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">VITE_FIREBASE_AUTH_DOMAIN</div>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">VITE_FIREBASE_PROJECT_ID</div>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">VITE_FIREBASE_STORAGE_BUCKET</div>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">VITE_FIREBASE_MESSAGING_SENDER_ID</div>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">VITE_FIREBASE_APP_ID</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                  Redeploy Application
                </h2>
                <div className="ml-11 text-gray-700">
                  <p>After adding the secrets, trigger a new deployment:</p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Push a new commit to the main branch, or</li>
                    <li>Manually re-run the GitHub Actions workflow</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer with Documentation Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  📚 For detailed instructions, check out the{' '}
                  <a
                    href="https://github.com/Vaibhavk11/HMI/blob/main/DEPLOY.md"
                    className="text-blue-600 hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DEPLOY.md
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://github.com/Vaibhavk11/HMI/blob/main/README.md"
                    className="text-blue-600 hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    README.md
                  </a>{' '}
                  files in the repository.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Check the{' '}
            <a
              href="https://github.com/Vaibhavk11/HMI"
              className="text-blue-600 hover:underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseStatus;
