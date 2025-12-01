import { UserProfile, DietPlan, GroceryList, WeeklyDietPlan, WorkoutPlan } from '../types/userProfile';

// Mock Data Generators (Keep these as fallbacks)
const getMockWorkoutPlan = (profile: UserProfile): WorkoutPlan => {
    return {
        id: 'mock-workout-id',
        goal: profile.goal,
        days: [
            {
                dayName: 'Day 1: Full Body Strength',
                focus: 'Strength',
                warmup: ['5 mins jumping jacks', 'arm circles'],
                exercises: [
                    { name: 'Squats', sets: '3 sets', reps: '12 reps', completed: false },
                    { name: 'Push-ups', sets: '3 sets', reps: '10 reps', notes: 'knees if needed', completed: false },
                    { name: 'Lunges', sets: '3 sets', reps: '12 reps per leg', completed: false },
                    { name: 'Plank', sets: '3 sets', reps: '30 seconds', duration: '30s', completed: false }
                ],
                cooldown: ['5 mins stretching'],
                completed: false
            },
            {
                dayName: 'Day 2: Cardio & Core',
                focus: 'Cardio',
                warmup: ['5 mins high knees'],
                exercises: [
                    { name: 'Jog/Run', sets: '1 set', reps: '20 mins', duration: '20m', notes: 'moderate pace', completed: false },
                    { name: 'Crunches', sets: '3 sets', reps: '15 reps', completed: false },
                    { name: 'Bicycle Crunches', sets: '3 sets', reps: '20 reps', completed: false }
                ],
                cooldown: ['5 mins walking & stretching'],
                completed: false
            },
            {
                dayName: 'Day 3: Active Recovery',
                focus: 'Recovery',
                warmup: [],
                exercises: [
                    { name: 'Yoga or Brisk Walk', sets: '1 set', reps: '30 mins', duration: '30m', completed: false }
                ],
                cooldown: [],
                completed: false
            }
        ]
    };
};

// ... (getMockDietPlan, getMockWeeklyDietPlan, getMockGroceryList remain unchanged)

// ... (callGeminiAPI remains unchanged)

export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlan> => {
    if (!profile.geminiApiKey) {
        console.log("Using mock workout plan (No Gemini API Key)");
        return new Promise(resolve => setTimeout(() => resolve(getMockWorkoutPlan(profile)), 1500));
    }

    const prompt = `
    Create a 7-day workout plan for a ${profile.age} year old ${profile.gender} 
    with height ${profile.height}cm and weight ${profile.weight}kg.
    Activity Level: ${profile.activityLevel}.
    Goal: ${profile.goal}.
    Workout Preference: ${profile.workoutPreference}.
    
    Return ONLY a JSON object with this structure (no markdown formatting, just raw JSON):
    {
      "id": "generated-workout-id",
      "goal": "${profile.goal}",
      "days": [
        {
          "dayName": string,
          "focus": string,
          "warmup": string[],
          "exercises": [
            { "name": string, "sets": string, "reps": string, "duration": string (optional), "notes": string (optional) }
          ],
          "cooldown": string[]
        }
      ]
    }
  `;

    try {
        const responseText = await callGeminiAPI(profile.geminiApiKey, prompt);
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        alert(`Gemini API failed: ${errorMessage}. Using mock data.`);
        return getMockWorkoutPlan(profile);
    }
};

const getMockDietPlan = (_profile: UserProfile): DietPlan => {
    return {
        id: 'mock-diet-id',
        createdAt: new Date(),
        totalMacros: {
            calories: 2000,
            protein: 150,
            carbs: 200,
            fats: 65,
            water: 3,
            fiber: 30
        },
        meals: [
            { id: 'm1', name: 'Breakfast', type: 'breakfast', description: 'Healthy start', items: [], ingredients: ['Oatmeal', 'Berries', 'Eggs'], calories: 400, protein: 20, carbs: 50, fats: 10 },
            { id: 'm2', name: 'Lunch', type: 'lunch', description: 'Power lunch', items: [], ingredients: ['Chicken Breast', 'Brown Rice', 'Vegetables'], calories: 600, protein: 40, carbs: 60, fats: 15 },
            { id: 'm3', name: 'Snack', type: 'snack', description: 'Afternoon boost', items: [], ingredients: ['Greek Yogurt', 'Almonds'], calories: 200, protein: 15, carbs: 10, fats: 10 },
            { id: 'm4', name: 'Dinner', type: 'dinner', description: 'Light dinner', items: [], ingredients: ['Salmon', 'Quinoa', 'Asparagus'], calories: 500, protein: 35, carbs: 40, fats: 20 },
        ]
    };
};

const getMockWeeklyDietPlan = (profile: UserProfile): WeeklyDietPlan => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return {
        id: 'mock-weekly-id',
        weekStartDate: new Date().toISOString(),
        days: days.map(day => ({
            ...getMockDietPlan(profile),
            dayName: day
        }))
    };
};

const getMockGroceryList = (): GroceryList => {
    return {
        items: [
            { name: 'Oats', category: 'Grains', quantity: '500g', estimatedCost: 150 },
            { name: 'Eggs', category: 'Dairy & Eggs', quantity: '12 pack', estimatedCost: 100 },
            { name: 'Chicken Breast', category: 'Meat', quantity: '1kg', estimatedCost: 350 },
            { name: 'Brown Rice', category: 'Grains', quantity: '1kg', estimatedCost: 120 },
            { name: 'Vegetables (Mix)', category: 'Produce', quantity: '2kg', estimatedCost: 200 },
        ],
        totalEstimatedCost: 920
    };
};

// Gemini API Helper
const callGeminiAPI = async (apiKey: string, prompt: string, model: string = 'gemini-2.5-pro') => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to call Gemini API');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};



export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
    if (!profile.geminiApiKey) {
        console.log("Using mock diet plan (No Gemini API Key)");
        return new Promise(resolve => setTimeout(() => resolve(getMockDietPlan(profile)), 1500));
    }

    const prompt = `
    Create a 1-day diet plan for a ${profile.age} year old ${profile.gender} (${profile.height}cm, ${profile.weight}kg).
    Region: ${profile.region}.
    Preference: ${profile.dietaryPreference}.
    Goal: ${profile.goal}.
    
    Return ONLY a JSON object with this structure (no markdown formatting, just raw JSON):
    {
      "id": "generated-id",
      "createdAt": "${new Date().toISOString()}",
      "totalMacros": { "calories": number, "protein": number, "carbs": number, "fats": number, "water": number, "fiber": number },
      "meals": [
        { "id": "m1", "name": string, "type": "breakfast|lunch|dinner|snack", "description": string, "items": [], "ingredients": string[], "calories": number, "protein": number, "carbs": number, "fats": number }
      ]
    }
  `;

    try {
        const responseText = await callGeminiAPI(profile.geminiApiKey, prompt);
        // Clean up potential markdown code blocks from response
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        alert(`Gemini API failed: ${errorMessage}. Using mock data.`);
        return getMockDietPlan(profile);
    }
};

export const generateWeeklyDietPlan = async (profile: UserProfile): Promise<WeeklyDietPlan> => {
    if (!profile.geminiApiKey) {
        console.log("Using mock weekly diet plan (No Gemini API Key)");
        return new Promise(resolve => setTimeout(() => resolve(getMockWeeklyDietPlan(profile)), 2000));
    }

    const prompt = `
    Create a 7-day weekly diet plan for a ${profile.age} year old ${profile.gender} (${profile.height}cm, ${profile.weight}kg).
    Region: ${profile.region}.
    Preference: ${profile.dietaryPreference}.
    Goal: ${profile.goal}.
    
    Return ONLY a JSON object with this structure (no markdown formatting, just raw JSON):
    {
      "id": "weekly-id",
      "weekStartDate": "${new Date().toISOString()}",
      "days": [
        {
            "dayName": string (e.g., "Monday"),
            "id": "generated-id",
            "createdAt": "${new Date().toISOString()}",
            "totalMacros": { "calories": number, "protein": number, "carbs": number, "fats": number, "water": number, "fiber": number },
            "meals": [
                { "id": "m1", "name": string, "type": "breakfast|lunch|dinner|snack", "description": string, "items": [], "ingredients": string[], "calories": number, "protein": number, "carbs": number, "fats": number }
            ]
        }
      ]
    }
  `;

    try {
        // Using gemini-2.0-flash which has a larger context window suitable for this
        const responseText = await callGeminiAPI(profile.geminiApiKey, prompt, 'gemini-2.5-pro');
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        alert(`Gemini API failed: ${errorMessage}. Using mock data.`);
        return getMockWeeklyDietPlan(profile);
    }
};

export const generateGroceryList = async (profile: UserProfile, dietPlan: DietPlan): Promise<GroceryList> => {
    if (!profile.geminiApiKey) {
        console.log("Using mock grocery list (No Gemini API Key)");
        return new Promise(resolve => setTimeout(() => resolve(getMockGroceryList()), 1000));
    }

    const prompt = `
    Generate a grocery list based on this diet plan: ${JSON.stringify(dietPlan)}.
    Region: ${profile.region}.
    Estimate costs in INR (Indian Rupees).
    
    Return ONLY a JSON object with this structure (no markdown formatting, just raw JSON):
    {
      "items": [
        { "name": string, "category": string, "quantity": string, "estimatedCost": number }
      ],
      "totalEstimatedCost": number
    }
  `;

    try {
        const responseText = await callGeminiAPI(profile.geminiApiKey, prompt);
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini API Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        alert(`Gemini API failed: ${errorMessage}. Using mock data.`);
        return getMockGroceryList();
    }
};

export const chatWithCoach = async (profile: UserProfile, message: string): Promise<string> => {
    if (!profile.geminiApiKey) {
        return new Promise(resolve => setTimeout(() => resolve("I'm a mock AI coach. Please add a valid Gemini API Key in your profile to chat with the real me!"), 1000));
    }

    const prompt = `
    You are a fitness and diet coach.
    User Profile: ${JSON.stringify(profile)}.
    User Message: ${message}
    
    Provide a helpful, motivating, and concise response.
  `;

    try {
        return await callGeminiAPI(profile.geminiApiKey, prompt);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I'm having trouble connecting to the server. Please check your API Key.";
    }
};
