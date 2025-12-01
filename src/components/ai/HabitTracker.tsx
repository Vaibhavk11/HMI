import React from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';

const HabitTracker: React.FC = () => {
    const { dailyHabits, updateDailyHabits, dietPlan } = useUserProfile();

    if (!dailyHabits) return null;

    const handleWaterChange = (amount: number) => {
        updateDailyHabits({
            ...dailyHabits,
            waterIntake: Math.max(0, dailyHabits.waterIntake + amount)
        });
    };

    const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateDailyHabits({
            ...dailyHabits,
            steps: parseInt(e.target.value) || 0
        });
    };

    const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateDailyHabits({
            ...dailyHabits,
            sleepHours: parseFloat(e.target.value) || 0
        });
    };

    const toggleMeal = (mealId: string) => {
        const newMealsEaten = dailyHabits.mealsEaten.includes(mealId)
            ? dailyHabits.mealsEaten.filter(id => id !== mealId)
            : [...dailyHabits.mealsEaten, mealId];

        updateDailyHabits({
            ...dailyHabits,
            mealsEaten: newMealsEaten
        });
    };

    return (
        <div className="space-y-6">
            {/* Water Tracker */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        <span>💧</span> Water Intake
                    </h3>
                    <span className="text-blue-700 font-bold text-2xl">{dailyHabits.waterIntake} <span className="text-sm font-normal">glasses</span></span>
                </div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => handleWaterChange(-1)}
                        className="w-12 h-12 rounded-full bg-white text-blue-600 font-bold shadow-sm hover:bg-blue-100 transition-colors text-xl"
                    >
                        -
                    </button>
                    <button
                        onClick={() => handleWaterChange(1)}
                        className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition-colors text-xl"
                    >
                        +
                    </button>
                </div>
                <div className="mt-4 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (dailyHabits.waterIntake / 8) * 100)}%` }}
                    ></div>
                </div>
                <div className="text-center text-xs text-blue-500 mt-2">Target: 8 glasses</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Steps Tracker */}
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
                    <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2 mb-4">
                        <span>👣</span> Steps
                    </h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={dailyHabits.steps}
                            onChange={handleStepsChange}
                            className="w-full text-3xl font-bold text-orange-700 bg-transparent border-b-2 border-orange-200 focus:border-orange-500 focus:outline-none text-center py-2"
                        />
                        <span className="text-orange-600 font-medium">steps</span>
                    </div>
                    <div className="mt-4 text-xs text-orange-500 text-center">Target: 10,000 steps</div>
                </div>

                {/* Sleep Tracker */}
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
                    <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2 mb-4">
                        <span>😴</span> Sleep
                    </h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={dailyHabits.sleepHours}
                            onChange={handleSleepChange}
                            step="0.5"
                            className="w-full text-3xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-200 focus:border-purple-500 focus:outline-none text-center py-2"
                        />
                        <span className="text-purple-600 font-medium">hours</span>
                    </div>
                    <div className="mt-4 text-xs text-purple-500 text-center">Target: 8 hours</div>
                </div>
            </div>

            {/* Meal Tracker */}
            {dietPlan && (
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 shadow-sm">
                    <h3 className="text-xl font-bold text-green-900 flex items-center gap-2 mb-4">
                        <span>🍽️</span> Meals Eaten
                    </h3>
                    <div className="space-y-3">
                        {dietPlan.meals.map((meal) => (
                            <div
                                key={meal.id}
                                onClick={() => toggleMeal(meal.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${dailyHabits.mealsEaten.includes(meal.id)
                                        ? 'bg-green-200 text-green-800 shadow-inner'
                                        : 'bg-white text-gray-600 hover:bg-green-100'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${dailyHabits.mealsEaten.includes(meal.id)
                                        ? 'border-green-600 bg-green-600 text-white'
                                        : 'border-gray-300'
                                    }`}>
                                    {dailyHabits.mealsEaten.includes(meal.id) && '✓'}
                                </div>
                                <div className="font-medium">{meal.name}</div>
                                <div className="text-xs ml-auto uppercase font-bold opacity-70">{meal.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitTracker;
