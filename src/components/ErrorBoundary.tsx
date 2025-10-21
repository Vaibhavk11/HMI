import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                ⚠️ Configuration Required
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                The PWA Notes App is not fully configured yet.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Firebase configuration is missing or invalid.</strong>
                    <br />
                    Please ensure all Firebase environment variables are properly set.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  For Repository Owners:
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2">
                  <li>Set up a Firebase project at <a href="https://console.firebase.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
                  <li>Enable Email/Password authentication</li>
                  <li>Create a Firestore database</li>
                  <li>Add your Firebase configuration as GitHub Secrets:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                      <li>VITE_FIREBASE_API_KEY</li>
                      <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                      <li>VITE_FIREBASE_PROJECT_ID</li>
                      <li>VITE_FIREBASE_STORAGE_BUCKET</li>
                      <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
                      <li>VITE_FIREBASE_APP_ID</li>
                    </ul>
                  </li>
                  <li>Redeploy the application</li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  For detailed setup instructions, see the{' '}
                  <a
                    href="https://github.com/Vaibhavk11/HMI/blob/main/DEPLOY.md"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DEPLOY.md
                  </a>{' '}
                  file in the repository.
                </p>
              </div>

              {this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
