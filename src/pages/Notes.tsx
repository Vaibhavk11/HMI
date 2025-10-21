import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchNotes, deleteNote } from '../utils/firestore';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadNotes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      const fetchedNotes = await fetchNotes(user.uid);
      setNotes(fetchedNotes);
      // Cache notes for offline use
      localStorage.setItem(`notes_${user.uid}`, JSON.stringify(fetchedNotes));
    } catch (err: any) {
      setError('Failed to load notes');
      // Try loading from cache
      const cached = localStorage.getItem(`notes_${user.uid}`);
      if (cached) {
        const cachedNotes = JSON.parse(cached);
        setNotes(
          cachedNotes.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt),
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();

    // Listen for online/offline events
    const handleOnline = () => {
      setOffline(false);
      loadNotes();
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  const handleDelete = async (noteId: string) => {
    if (!user) return;

    try {
      await deleteNote(user.uid, noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container-mobile flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container-mobile">
        {offline && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            You are offline. Showing cached notes.
          </div>
        )}

        {error && !notes.length && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <button onClick={handleCreateNote} className="btn-primary">
            + New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No notes yet. Create your first note!</p>
            <button onClick={handleCreateNote} className="btn-primary">
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleEditNote(note.id)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </>
  );
};

export default Notes;
