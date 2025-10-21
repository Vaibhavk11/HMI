import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import ProtectedRoute from './components/ProtectedRoute';
// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import NoteEditor from './pages/NoteEditor';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import WorkoutComplete from './pages/WorkoutComplete';
import Progress from './pages/Progress';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/HMI/">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WorkoutProvider>
                  <Dashboard />
                </WorkoutProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WorkoutProvider>
                  <Dashboard />
                </WorkoutProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/active"
            element={
              <ProtectedRoute>
                <WorkoutProvider>
                  <ActiveWorkout />
                </WorkoutProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/complete"
            element={
              <ProtectedRoute>
                <WorkoutProvider>
                  <WorkoutComplete />
                </WorkoutProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
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
  );
};

export default App;
