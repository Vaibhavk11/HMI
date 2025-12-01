import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ProfileSetup from '../components/ai/ProfileSetup';
import { useUserProfile } from '../contexts/UserProfileContext';
import WorkoutPlanDisplay from '../components/ai/WorkoutPlanDisplay';
import DietPlanDisplay from '../components/ai/DietPlanDisplay';
import WeeklyDietDisplay from '../components/ai/WeeklyDietDisplay';
import GroceryListDisplay from '../components/ai/GroceryListDisplay';
import DailyGoalProgress from '../components/ai/DailyGoalProgress';
import HabitTracker from '../components/ai/HabitTracker';
import AIChatCoach from '../components/ai/AIChatCoach';
import { generateWorkoutPlan, generateDietPlan, generateWeeklyDietPlan, generateGroceryList } from '../services/ai';

const AIPlanner: React.FC = () => {
    const {
        profile,
        workoutPlan,
        dietPlan,
        weeklyDietPlan,
        groceryList,
        updateWorkoutPlan,
        updateDietPlan,
        updateWeeklyDietPlan,
        updateGroceryList,
        loading
    } = useUserProfile();
    const [activeTab, setActiveTab] = useState<'profile' | 'workout' | 'diet' | 'tracker' | 'chat'>('profile');
    const [dietMode, setDietMode] = useState<'daily' | 'weekly'>('daily');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateWorkout = async () => {
        if (!profile) return;
        setIsGenerating(true);
        try {
            const plan = await generateWorkoutPlan(profile);
            await updateWorkoutPlan(plan);
        } catch (error) {
            console.error(error);
            alert('Failed to generate workout plan. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateDiet = async () => {
        if (!profile) return;
        setIsGenerating(true);
        try {
            if (dietMode === 'daily') {
                const plan = await generateDietPlan(profile);
                await updateDietPlan(plan);
            } else {
                const plan = await generateWeeklyDietPlan(profile);
                await updateWeeklyDietPlan(plan);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate diet plan. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">AI Coach 🤖</h1>
                    <p className="text-gray-600">Your personalized fitness & diet planner</p>
                </header>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {(['profile', 'workout', 'diet', 'tracker', 'chat'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'profile' && '👤 Profile'}
                            {tab === 'workout' && '💪 Workout Plan'}
                            {tab === 'diet' && '🥗 Diet Plan'}
                            {tab === 'tracker' && '📊 Tracker'}
                            {tab === 'chat' && '💬 Chat Coach'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <DailyGoalProgress />
                            <ProfileSetup />
                        </>
                    )}

                    {activeTab === 'workout' && (
                        <div className="space-y-6">
                            {!profile ? (
                                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Required</h2>
                                    <p className="text-gray-600 mb-6">Please complete your profile to generate a personalized workout plan.</p>
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Go to Profile Setup &rarr;
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-gray-900">Your Workout Plan</h2>
                                            <button
                                                onClick={handleGenerateWorkout}
                                                disabled={isGenerating}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-blue-300 flex items-center gap-2"
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <span className="animate-spin">↻</span> Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>⚡</span> Regenerate Plan
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {workoutPlan ? (
                                            <WorkoutPlanDisplay
                                                plan={workoutPlan}
                                                onSave={(newPlan) => updateWorkoutPlan(newPlan)}
                                            />
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                <div className="text-4xl mb-3">💪</div>
                                                <p className="text-gray-500 mb-4">No plan generated yet.</p>
                                                <button
                                                    onClick={handleGenerateWorkout}
                                                    disabled={isGenerating}
                                                    className="text-blue-600 font-bold hover:underline"
                                                >
                                                    Generate My Plan Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'diet' && (
                        <div className="space-y-6">
                            {!profile ? (
                                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                                    <div className="text-6xl mb-4">🥗</div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Required</h2>
                                    <p className="text-gray-600 mb-6">Please complete your profile to generate a personalized diet plan.</p>
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Go to Profile Setup &rarr;
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                            <h2 className="text-xl font-bold text-gray-900">Your Diet Plan</h2>

                                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                                <button
                                                    onClick={() => setDietMode('daily')}
                                                    className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${dietMode === 'daily' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                                        }`}
                                                >
                                                    Daily
                                                </button>
                                                <button
                                                    onClick={() => setDietMode('weekly')}
                                                    className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${dietMode === 'weekly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                                        }`}
                                                >
                                                    Weekly
                                                </button>
                                            </div>

                                            <button
                                                onClick={handleGenerateDiet}
                                                disabled={isGenerating}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:bg-green-300 flex items-center gap-2 w-full md:w-auto justify-center"
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <span className="animate-spin">↻</span> Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>⚡</span> Regenerate {dietMode === 'weekly' ? 'Week' : 'Day'}
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {dietMode === 'daily' ? (
                                            dietPlan ? (
                                                <>
                                                    <DietPlanDisplay plan={dietPlan} />
                                                    {groceryList && <GroceryListDisplay list={groceryList} />}
                                                </>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                    <div className="text-4xl mb-3">🥗</div>
                                                    <p className="text-gray-500 mb-4">No diet plan generated yet.</p>
                                                    <button
                                                        onClick={handleGenerateDiet}
                                                        disabled={isGenerating}
                                                        className="text-blue-600 font-bold hover:underline"
                                                    >
                                                        Generate My Diet Plan
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            weeklyDietPlan ? (
                                                <>
                                                    <WeeklyDietDisplay weeklyPlan={weeklyDietPlan.days} />
                                                    {groceryList && <GroceryListDisplay list={groceryList} />}
                                                </>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                    <div className="text-4xl mb-3">📅</div>
                                                    <p className="text-gray-500 mb-4">No weekly plan generated yet.</p>
                                                    <button
                                                        onClick={handleGenerateDiet}
                                                        disabled={isGenerating}
                                                        className="text-blue-600 font-bold hover:underline"
                                                    >
                                                        Generate Weekly Plan
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'tracker' && (
                        <HabitTracker />
                    )}

                    {activeTab === 'chat' && (
                        <AIChatCoach />
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default AIPlanner;
