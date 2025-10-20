import { OfflineQueueItem } from '../types';

const QUEUE_KEY = 'offline_queue';

// Get the offline queue from localStorage
export const getOfflineQueue = (): OfflineQueueItem[] => {
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error reading offline queue:', error);
    return [];
  }
};

// Add an item to the offline queue
export const addToOfflineQueue = (item: Omit<OfflineQueueItem, 'id' | 'timestamp'>): void => {
  try {
    const queue = getOfflineQueue();
    const newItem: OfflineQueueItem = {
      ...item,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    queue.push(newItem);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to offline queue:', error);
  }
};

// Remove an item from the offline queue
export const removeFromOfflineQueue = (itemId: string): void => {
  try {
    const queue = getOfflineQueue();
    const filteredQueue = queue.filter((item) => item.id !== itemId);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filteredQueue));
  } catch (error) {
    console.error('Error removing from offline queue:', error);
  }
};

// Clear the entire offline queue
export const clearOfflineQueue = (): void => {
  try {
    localStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing offline queue:', error);
  }
};

// Check if the app is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};
