export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'maintenance';
export type WorkoutPreference = 'home' | 'gym';
export type DietaryPreference = 'veg' | 'non_veg' | 'egg' | 'vegan';
export type Region = 'north_india' | 'south_india' | 'east_india' | 'west_india';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';

export interface UserProfile {
    age: number;
    gender: Gender;
    height: number; // in cm
    weight: number; // in kg
    goal: FitnessGoal;
    workoutPreference: WorkoutPreference;
    dietaryPreference: DietaryPreference;
    region: Region;
    activityLevel: ActivityLevel;
    allergies?: string[];
    dailyTimeAvailability?: number; // in minutes
    geminiApiKey?: string; // Optional API key
}

export interface MacroTargets {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fats: number; // grams
    water: number; // liters
    fiber: number; // grams
}

export interface DietMeal {
    id: string;
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    ingredients: string[];
    items?: string[];
}

export interface DietPlan {
    id: string;
    createdAt: Date;
    dayName?: string; // e.g., "Monday"
    meals: DietMeal[];
    totalMacros: MacroTargets;
}

export interface WeeklyDietPlan {
    id: string;
    weekStartDate: string;
    days: DietPlan[];
}

export interface GroceryItem {
    name: string;
    category: string;
    quantity: string;
    estimatedCost: number; // in INR
}

export interface GroceryList {
    items: GroceryItem[];
    totalEstimatedCost: number;
}

export interface DailyHabits {
    date: string; // YYYY-MM-DD
    waterIntake: number; // glasses (250ml)
    steps: number;
    sleepHours: number;
    mealsEaten: string[]; // IDs of meals eaten
    workoutCompleted: boolean;
}

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    duration?: string;
    notes?: string;
    completed?: boolean; // For tracking progress
}

export interface WorkoutDay {
    dayName: string;
    focus: string;
    warmup: string[];
    exercises: Exercise[];
    cooldown: string[];
    completed?: boolean;
}

export interface WorkoutPlan {
    id: string;
    goal: string;
    days: WorkoutDay[];
}
