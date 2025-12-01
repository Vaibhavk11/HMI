import React from 'react';
import { DietPlan } from '../../types/userProfile';

interface DietPlanDisplayProps {
    plan: DietPlan;
}

const DietPlanDisplay: React.FC<DietPlanDisplayProps> = ({ plan }) => {
    return (
        <div className="space-y-6">
            {/* Macros Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <h3 className="text-lg font-bold text-green-900 mb-3">Daily Targets</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 uppercase">Calories</div>
                        <div className="font-bold text-green-700">{plan.totalMacros.calories}</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 uppercase">Protein</div>
                        <div className="font-bold text-green-700">{plan.totalMacros.protein}g</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 uppercase">Carbs</div>
                        <div className="font-bold text-green-700">{plan.totalMacros.carbs}g</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 uppercase">Fats</div>
                        <div className="font-bold text-green-700">{plan.totalMacros.fats}g</div>
                    </div>
                </div>
            </div>

            {/* Meals */}
            <div className="space-y-4">
                {plan.meals.map((meal) => (
                    <div key={meal.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase mb-1 ${meal.type === 'breakfast' ? 'bg-orange-100 text-orange-700' :
                                        meal.type === 'lunch' ? 'bg-blue-100 text-blue-700' :
                                            meal.type === 'dinner' ? 'bg-purple-100 text-purple-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {meal.type}
                                </span>
                                <h4 className="font-bold text-gray-900 text-lg">{meal.name}</h4>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900">{meal.calories} kcal</div>
                                <div className="text-xs text-gray-500">
                                    P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ing, idx) => (
                                <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DietPlanDisplay;
