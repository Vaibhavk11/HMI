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
import TestWorkout from './pages/TestWorkout';
import WorkoutComplete from './pages/WorkoutComplete';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import AIPlanner from './pages/AIPlanner';
import { UserProfileProvider } from './contexts/UserProfileContext';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/HMI/">
      <AuthProvider>
        <UserProfileProvider>
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
              path="/ai-planner"
              element={
                <ProtectedRoute>
                  <AIPlanner />
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
              path="/workout/test"
              element={
                <ProtectedRoute>
                  <TestWorkout />
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
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
