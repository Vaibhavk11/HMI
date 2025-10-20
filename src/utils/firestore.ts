import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Note, NoteInput, FirestoreNote } from '../types';

// Convert Firestore timestamp to Date
const timestampToDate = (timestamp: { seconds: number; nanoseconds: number }): Date => {
  return new Date(timestamp.seconds * 1000);
};

// Get user's notes collection reference
const getNotesCollection = (uid: string) => {
  return collection(db, 'users', uid, 'notes');
};

// Fetch all notes for a user
export const fetchNotes = async (uid: string): Promise<Note[]> => {
  try {
    const notesRef = getNotesCollection(uid);
    const q = query(notesRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const notes: Note[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<FirestoreNote, 'id'>;
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        ownerUid: data.ownerUid,
      };
    });

    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Create a new note
export const createNote = async (uid: string, noteData: NoteInput): Promise<string> => {
  try {
    const notesRef = getNotesCollection(uid);
    const now = serverTimestamp();

    const docRef = await addDoc(notesRef, {
      ...noteData,
      ownerUid: uid,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update an existing note
export const updateNote = async (
  uid: string,
  noteId: string,
  noteData: Partial<NoteInput>
): Promise<void> => {
  try {
    const noteRef = doc(db, 'users', uid, 'notes', noteId);
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (uid: string, noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'users', uid, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Get a single note by ID
export const getNote = async (uid: string, noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, 'users', uid, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);

    if (noteSnap.exists()) {
      const data = noteSnap.data() as Omit<FirestoreNote, 'id'>;
      return {
        id: noteSnap.id,
        title: data.title,
        content: data.content,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
        ownerUid: data.ownerUid,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting note:', error);
    throw error;
  }
};
