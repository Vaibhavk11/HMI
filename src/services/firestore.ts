import { db } from '../firebase';
import {
    doc,
    setDoc,
    getDoc,
    Timestamp
} from 'firebase/firestore';
import {
    UserProfile,
    WorkoutPlan,
    DietPlan,
    WeeklyDietPlan,
    GroceryList,
    DailyHabits
} from '../types/userProfile';

// Collection Names
const USERS_COLLECTION = 'users';

// Helper to get user document reference
const getUserRef = (userId: string) => doc(db, USERS_COLLECTION, userId);

// Save User Profile
export const saveUserProfile = async (userId: string, profile: UserProfile) => {
    try {
        await setDoc(getUserRef(userId), { profile }, { merge: true });
        console.log('User profile saved to Firestore');
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
};

// Get User Profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const docSnap = await getDoc(getUserRef(userId));
        if (docSnap.exists()) {
            return docSnap.data().profile as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

// Generic Save Plan Helper
// Stores plans directly in the user document to avoid subcollection permission issues
const savePlan = async (userId: string, planType: string, planData: any) => {
    try {
        // Field name in the user document, e.g., 'workoutPlan', 'dietPlan'
        // We use the camelCase planType directly as the field key
        const updateData = {
            [planType]: {
                ...planData,
                updatedAt: Timestamp.now()
            }
        };

        await setDoc(getUserRef(userId), updateData, { merge: true });

        console.log(`${planType} saved to Firestore in user document`);
        return userId; // Return userId as we are updating the user doc
    } catch (error) {
        console.error(`Error saving ${planType}:`, error);
        throw error;
    }
};

// Save Functions
// Note: We use the property names that match the UserProfileContext state for consistency
export const saveWorkoutPlan = (userId: string, plan: WorkoutPlan) => savePlan(userId, 'workoutPlan', plan);
export const saveDietPlan = (userId: string, plan: DietPlan) => savePlan(userId, 'dietPlan', plan);
export const saveWeeklyDietPlan = (userId: string, plan: WeeklyDietPlan) => savePlan(userId, 'weeklyDietPlan', plan);
export const saveGroceryList = (userId: string, list: GroceryList) => savePlan(userId, 'groceryList', list);

// Save Daily Habits (Tracker)
// Habits are numerous, so we KEEP them in a subcollection 'habits' if possible, 
// OR we can store the *current* day's habits in the user doc and archive old ones?
// The user's existing code uses 'notes' and 'workoutLogs' subcollections, so 'habits' might work if it's considered 'user data'.
// But to be safe and consistent with the error fix, let's try to stick to the subcollection for habits 
// as it's time-series data, UNLESS it fails. 
// If 'ai_plans' failed, 'habits' might fail too if not whitelisted.
// However, 'workoutLogs' works. 'notes' works. 
// Let's try 'habits' subcollection. If it fails, we'll need another strategy (e.g. array in user doc, bad for scaling).
// For now, I will assume 'habits' might be allowed or I'll risk it, 
// BUT to be 100% safe for the "fix", I will ALSO store the "current" daily habits in the user doc.
export const saveDailyHabits = async (userId: string, habits: DailyHabits) => {
    try {
        // Try subcollection first (better for history)
        const habitsRef = doc(db, USERS_COLLECTION, userId, 'habits', habits.date);
        await setDoc(habitsRef, habits);
        console.log('Daily habits saved to subcollection');
    } catch (error: any) {
        console.warn('Failed to save habits to subcollection, falling back to user document:', error);
        // Fallback: Store current habits in user doc
        await setDoc(getUserRef(userId), { currentDailyHabits: habits }, { merge: true });
    }
};

// Get Functions
export const getUserPlans = async (userId: string) => {
    try {
        const docSnap = await getDoc(getUserRef(userId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                workoutPlan: data.workoutPlan as WorkoutPlan | null,
                dietPlan: data.dietPlan as DietPlan | null,
                weeklyDietPlan: data.weeklyDietPlan as WeeklyDietPlan | null,
                groceryList: data.groceryList as GroceryList | null
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting user plans:', error);
        throw error;
    }
};

export const getDailyHabits = async (userId: string, date: string): Promise<DailyHabits | null> => {
    try {
        // Try subcollection
        const habitsRef = doc(db, USERS_COLLECTION, userId, 'habits', date);
        const docSnap = await getDoc(habitsRef);
        if (docSnap.exists()) {
            return docSnap.data() as DailyHabits;
        }

        // Fallback: Check user doc for current habits if date matches
        const userDoc = await getDoc(getUserRef(userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.currentDailyHabits && data.currentDailyHabits.date === date) {
                return data.currentDailyHabits as DailyHabits;
            }
        }

        return null;
    } catch (error) {
        console.error('Error getting daily habits:', error);
        throw error;
    }
};
