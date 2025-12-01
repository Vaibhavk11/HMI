import React, { useState } from 'react';
import { DietPlan } from '../../types/userProfile';
import DietPlanDisplay from './DietPlanDisplay';

interface WeeklyDietDisplayProps {
    weeklyPlan: DietPlan[];
}

const WeeklyDietDisplay: React.FC<WeeklyDietDisplayProps> = ({ weeklyPlan }) => {
    const [activeDayIndex, setActiveDayIndex] = useState(0);

    return (
        <div className="space-y-6">
            {/* Day Selector */}
            <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
                {weeklyPlan.map((plan, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveDayIndex(index)}
                        className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeDayIndex === index
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-green-700 border border-green-100 hover:bg-green-50'
                            }`}
                    >
                        {plan.dayName || `Day ${index + 1}`}
                    </button>
                ))}
            </div>

            {/* Active Day Plan */}
            <div className="animate-fade-in">
                <DietPlanDisplay plan={weeklyPlan[activeDayIndex]} />
            </div>
        </div>
    );
};

export default WeeklyDietDisplay;
