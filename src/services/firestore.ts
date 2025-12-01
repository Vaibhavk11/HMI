import { db } from '../firebase';
import {
    doc,
    setDoc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
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
const PLANS_COLLECTION = 'ai_plans';

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
const savePlan = async (userId: string, planType: string, planData: any) => {
    try {
        // We store plans in a subcollection or a separate collection with userId
        // Using a separate collection 'ai_plans' with a composite ID or just querying by userId is cleaner for this app size.
        // Let's use a single document per user for current plans to keep it simple and fast, 
        // or separate documents if we want history. 
        // Requirement: "save response ... on new document"

        // Let's create a new document in 'ai_plans' collection
        const planRef = doc(collection(db, PLANS_COLLECTION));
        await setDoc(planRef, {
            userId,
            type: planType,
            data: planData,
            createdAt: Timestamp.now()
        });

        // Also update the user's "current" plan reference for easy access
        await setDoc(getUserRef(userId), {
            [`current_${planType}`]: planData
        }, { merge: true });

        console.log(`${planType} saved to Firestore`);
        return planRef.id;
    } catch (error) {
        console.error(`Error saving ${planType}:`, error);
        throw error;
    }
};

// Save Functions
export const saveWorkoutPlan = (userId: string, plan: WorkoutPlan) => savePlan(userId, 'workout_plan', plan);
export const saveDietPlan = (userId: string, plan: DietPlan) => savePlan(userId, 'diet_plan', plan);
export const saveWeeklyDietPlan = (userId: string, plan: WeeklyDietPlan) => savePlan(userId, 'weekly_diet_plan', plan);
export const saveGroceryList = (userId: string, list: GroceryList) => savePlan(userId, 'grocery_list', list);

// Save Daily Habits (Tracker)
// For tracker, we might want a subcollection 'habits' under the user
export const saveDailyHabits = async (userId: string, habits: DailyHabits) => {
    try {
        const habitsRef = doc(db, USERS_COLLECTION, userId, 'habits', habits.date);
        await setDoc(habitsRef, habits);
        console.log('Daily habits saved');
    } catch (error) {
        console.error('Error saving daily habits:', error);
        throw error;
    }
};

// Get Functions (Fetching "Current" plans from User Document for speed/simplicity as per current app structure)
export const getUserPlans = async (userId: string) => {
    try {
        const docSnap = await getDoc(getUserRef(userId));
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                workoutPlan: data.current_workout_plan as WorkoutPlan | null,
                dietPlan: data.current_diet_plan as DietPlan | null,
                weeklyDietPlan: data.current_weekly_diet_plan as WeeklyDietPlan | null,
                groceryList: data.current_grocery_list as GroceryList | null
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
        const habitsRef = doc(db, USERS_COLLECTION, userId, 'habits', date);
        const docSnap = await getDoc(habitsRef);
        if (docSnap.exists()) {
            return docSnap.data() as DailyHabits;
        }
        return null;
    } catch (error) {
        console.error('Error getting daily habits:', error);
        throw error;
    }
};
