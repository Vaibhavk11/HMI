import React, { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutDay, Exercise } from '../../types/userProfile';

interface WorkoutPlanDisplayProps {
    plan: WorkoutPlan;
    onSave?: (newPlan: WorkoutPlan) => void;
}

const WorkoutPlanDisplay: React.FC<WorkoutPlanDisplayProps> = ({ plan, onSave }) => {
    const [localPlan, setLocalPlan] = useState<WorkoutPlan>(plan);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    useEffect(() => {
        setLocalPlan(plan);
    }, [plan]);

    const toggleExercise = (dayIndex: number, exerciseIndex: number) => {
        const newPlan = { ...localPlan };
        const day = newPlan.days[dayIndex];
        const exercise = day.exercises[exerciseIndex];

        exercise.completed = !exercise.completed;

        // Check if all exercises in the day are completed
        const allCompleted = day.exercises.every(ex => ex.completed);
        day.completed = allCompleted;

        setLocalPlan(newPlan);
        if (onSave) {
            onSave(newPlan);
        }
    };

    const toggleDay = (dayName: string) => {
        if (expandedDay === dayName) {
            setExpandedDay(null);
        } else {
            setExpandedDay(dayName);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-blue-900">Goal: {localPlan.goal.replace('_', ' ')}</h3>
                <p className="text-blue-700 text-sm">Follow this plan for best results!</p>
            </div>

            <div className="space-y-4">
                {localPlan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className={`bg-white rounded-xl shadow-sm border transition-all ${day.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <button
                            onClick={() => toggleDay(day.dayName)}
                            className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                        >
                            <div>
                                <h4 className={`font-bold text-lg ${day.completed ? 'text-green-800' : 'text-gray-900'}`}>
                                    {day.dayName}
                                </h4>
                                <p className="text-sm text-gray-500">{day.focus}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {day.completed && (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                        COMPLETED
                                    </span>
                                )}
                                <span className="text-gray-400 text-xl">
                                    {expandedDay === day.dayName ? '▲' : '▼'}
                                </span>
                            </div>
                        </button>

                        {expandedDay === day.dayName && (
                            <div className="p-4 pt-0 border-t border-gray-100">
                                <div className="mt-4 mb-4">
                                    <h5 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Warm-up</h5>
                                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 pl-2">
                                        {day.warmup.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Exercises</h5>
                                    {day.exercises.map((exercise, exIndex) => (
                                        <div
                                            key={exIndex}
                                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${exercise.completed ? 'bg-green-100/50' : 'bg-gray-50 hover:bg-gray-100'}`}
                                        >
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={exercise.completed || false}
                                                    onChange={() => toggleExercise(dayIndex, exIndex)}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <span className={`font-semibold ${exercise.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                        {exercise.name}
                                                    </span>
                                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                                                        {exercise.sets} x {exercise.reps}
                                                    </span>
                                                </div>
                                                {exercise.duration && (
                                                    <p className="text-xs text-blue-600 mt-1">⏱ {exercise.duration}</p>
                                                )}
                                                {exercise.notes && (
                                                    <p className="text-xs text-gray-500 mt-1 italic">{exercise.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {day.cooldown.length > 0 && (
                                    <div className="mt-6">
                                        <h5 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Cool-down</h5>
                                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 pl-2">
                                            {day.cooldown.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutPlanDisplay;
