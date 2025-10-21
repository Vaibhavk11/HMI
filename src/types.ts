// User type for authentication
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Note data model - stored in Firestore under users/{uid}/notes
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUid: string;
}

// Note data without ID (for creating new notes)
export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'ownerUid'>;

// Firestore timestamp type
export interface FirestoreNote {
  id: string;
  title: string;
  content: string;
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  ownerUid: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Offline queue item for pending writes
export interface OfflineQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  note?: NoteInput | Note;
  noteId?: string;
  timestamp: number;
}
