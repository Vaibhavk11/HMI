import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DietPlan, GroceryList, DailyHabits, MacroTargets, WorkoutPlan, WeeklyDietPlan } from '../types/userProfile';
import { useAuth } from './AuthContext';
import {
    saveUserProfile,
    getUserProfile,
    getUserPlans,
    saveDietPlan,
    saveGroceryList,
    saveDailyHabits,
    saveWorkoutPlan,
    saveWeeklyDietPlan
} from '../services/firestore';

interface UserProfileContextType {
    profile: UserProfile | null;
    dietPlan: DietPlan | null;
    weeklyDietPlan: WeeklyDietPlan | null;
    workoutPlan: WorkoutPlan | null;
    groceryList: GroceryList | null;
    dailyHabits: DailyHabits | null;
    updateProfile: (profile: UserProfile) => Promise<void>;
    updateDietPlan: (plan: DietPlan) => Promise<void>;
    updateWeeklyDietPlan: (plan: WeeklyDietPlan) => Promise<void>;
    updateWorkoutPlan: (plan: WorkoutPlan) => Promise<void>;
    updateGroceryList: (list: GroceryList) => Promise<void>;
    updateDailyHabits: (habits: DailyHabits) => Promise<void>;
    calculateDailyTargets: () => MacroTargets | null;
    loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};

interface UserProfileProviderProps {
    children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
    const [weeklyDietPlan, setWeeklyDietPlan] = useState<WeeklyDietPlan | null>(null);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
    const [dailyHabits, setDailyHabits] = useState<DailyHabits | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from Firestore on mount or user change
    useEffect(() => {
        const loadUserData = async () => {
            if (!user) {
                setProfile(null);
                setDietPlan(null);
                setWeeklyDietPlan(null);
                setWorkoutPlan(null);
                setGroceryList(null);
                setDailyHabits(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Load Profile
                const userProfile = await getUserProfile(user.uid);
                if (userProfile) setProfile(userProfile);

                // Load Plans
                const plans = await getUserPlans(user.uid);
                if (plans) {
                    if (plans.workoutPlan) setWorkoutPlan(plans.workoutPlan);
                    if (plans.dietPlan) setDietPlan(plans.dietPlan);
                    if (plans.weeklyDietPlan) setWeeklyDietPlan(plans.weeklyDietPlan);
                    if (plans.groceryList) setGroceryList(plans.groceryList);
                }

                // Load Habits (Mock init for now, or fetch if implemented)
                const today = new Date().toISOString().split('T')[0];
                setDailyHabits({
                    date: today,
                    waterIntake: 0,
                    steps: 0,
                    sleepHours: 0,
                    mealsEaten: [],
                    workoutCompleted: false
                });

            } catch (error) {
                console.error("Failed to load user data", error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [user]);

    const updateProfile = async (newProfile: UserProfile) => {
        setProfile(newProfile);
        if (user) {
            await saveUserProfile(user.uid, newProfile);
        }
    };

    const updateDietPlan = async (newPlan: DietPlan) => {
        setDietPlan(newPlan);
        if (user) {
            await saveDietPlan(user.uid, newPlan);
        }
    };

    const updateWeeklyDietPlan = async (newPlan: WeeklyDietPlan) => {
        setWeeklyDietPlan(newPlan);
        if (user) {
            await saveWeeklyDietPlan(user.uid, newPlan);
        }
    };

    const updateWorkoutPlan = async (newPlan: WorkoutPlan) => {
        setWorkoutPlan(newPlan);
        if (user) {
            await saveWorkoutPlan(user.uid, newPlan);
        }
    };

    const updateGroceryList = async (newList: GroceryList) => {
        setGroceryList(newList);
        if (user) {
            await saveGroceryList(user.uid, newList);
        }
    };

    const updateDailyHabits = async (newHabits: DailyHabits) => {
        setDailyHabits(newHabits);
        if (user) {
            await saveDailyHabits(user.uid, newHabits);
        }
    };

    const calculateDailyTargets = (): MacroTargets | null => {
        if (!profile) return null;

        // Mifflin-St Jeor Equation
        let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age;
        bmr += profile.gender === 'male' ? 5 : -161;

        // Activity Multiplier
        const activityMultipliers: Record<string, number> = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
            extra_active: 1.9
        };

        const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2);

        // Goal Adjustment
        let targetCalories = tdee;
        if (profile.goal === 'fat_loss') targetCalories -= 500;
        else if (profile.goal === 'muscle_gain') targetCalories += 300;

        // Macro Split (Approximate)
        // Protein: 2g per kg of bodyweight (high protein for fitness)
        const protein = profile.weight * 2;
        const proteinCals = protein * 4;

        // Fats: 0.8g per kg
        const fats = profile.weight * 0.8;
        const fatCals = fats * 9;

        // Carbs: Remainder
        const remainingCals = targetCalories - proteinCals - fatCals;
        const carbs = Math.max(0, remainingCals / 4);

        return {
            calories: Math.round(targetCalories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fats: Math.round(fats),
            water: 3, // liters (baseline)
            fiber: 30 // grams (baseline)
        };
    };

    return (
        <UserProfileContext.Provider
            value={{
                profile,
                dietPlan,
                weeklyDietPlan,
                workoutPlan,
                groceryList,
                dailyHabits,
                updateProfile,
                updateDietPlan,
                updateWeeklyDietPlan,
                updateWorkoutPlan,
                updateGroceryList,
                updateDailyHabits,
                calculateDailyTargets,
                loading
            }}
        >
            {children}
        </UserProfileContext.Provider>
    );
};
