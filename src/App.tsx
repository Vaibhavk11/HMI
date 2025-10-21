import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import FirebaseStatus from './components/FirebaseStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import NoteEditor from './pages/NoteEditor';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];
  return requiredVars.every((varName) => import.meta.env[varName]);
};

const App: React.FC = () => {
  // Show Firebase configuration page if not configured
  if (!isFirebaseConfigured()) {
    return <FirebaseStatus />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter basename="/HMI/">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
