import React from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';

const DailyGoalProgress: React.FC = () => {
    const { calculateDailyTargets } = useUserProfile();
    const targets = calculateDailyTargets();

    if (!targets) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🎯</span> Daily Goals
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Calories */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-orange-600 font-bold text-xl">{targets.calories}</span>
                        <span className="text-orange-400 text-xs font-medium uppercase mb-1">kcal</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-xs text-orange-500 mt-2 font-medium">Target Calories</div>
                </div>

                {/* Protein */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-blue-600 font-bold text-xl">{targets.protein}g</span>
                        <span className="text-blue-400 text-xs font-medium uppercase mb-1">Protein</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-xs text-blue-500 mt-2 font-medium">Build Muscle</div>
                </div>

                {/* Carbs */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-green-600 font-bold text-xl">{targets.carbs}g</span>
                        <span className="text-green-400 text-xs font-medium uppercase mb-1">Carbs</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-xs text-green-500 mt-2 font-medium">Energy</div>
                </div>

                {/* Fats */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-purple-600 font-bold text-xl">{targets.fats}g</span>
                        <span className="text-purple-400 text-xs font-medium uppercase mb-1">Fats</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-xs text-purple-500 mt-2 font-medium">Health</div>
                </div>
            </div>
        </div>
    );
};

export default DailyGoalProgress;
