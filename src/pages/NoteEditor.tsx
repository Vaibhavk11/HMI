import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createNote, getNote, updateNote } from '../utils/firestore';
import { NoteInput } from '../types';
import Header from '../components/Header';
import { addToOfflineQueue } from '../utils/offline';

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNewNote = id === 'new';

  useEffect(() => {
    if (!isNewNote && id && user) {
      loadNote();
    }
  }, [id, user]);

  const loadNote = async () => {
    if (!user || !id || id === 'new') return;

    try {
      setLoading(true);
      const note = await getNote(user.uid, id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      } else {
        setError('Note not found');
      }
    } catch (err) {
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!title.trim() && !content.trim()) {
      setError('Please add a title or content');
      return;
    }

    const noteData: NoteInput = {
      title: title.trim(),
      content: content.trim(),
    };

    try {
      setSaving(true);
      setError('');

      if (isNewNote) {
        // Check if online
        if (!navigator.onLine) {
          // Queue for offline sync
          addToOfflineQueue({ type: 'create', note: noteData });
          alert('You are offline. Note will be created when you reconnect.');
          navigate('/');
          return;
        }
        await createNote(user.uid, noteData);
      } else if (id) {
        if (!navigator.onLine) {
          addToOfflineQueue({ type: 'update', noteId: id, note: noteData });
          alert('You are offline. Changes will be saved when you reconnect.');
          navigate('/');
          return;
        }
        await updateNote(user.uid, id, noteData);
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isNewNote ? 'Create Note' : 'Edit Note'}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content..."
                rows={12}
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save Note'}
              </button>
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteEditor;
