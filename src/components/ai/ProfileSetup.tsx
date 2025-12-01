import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, FitnessGoal, WorkoutPreference, DietaryPreference, Region, ActivityLevel } from '../../types/userProfile';
import { useUserProfile } from '../../contexts/UserProfileContext';

const ProfileSetup: React.FC = () => {
    const { profile, updateProfile } = useUserProfile();
    const [formData, setFormData] = useState<UserProfile>({
        age: 25,
        gender: 'male',
        height: 170,
        weight: 70,
        goal: 'fat_loss',
        workoutPreference: 'home',
        dietaryPreference: 'veg',
        region: 'north_india',
        activityLevel: 'moderately_active',
        allergies: [],
        dailyTimeAvailability: 60,
        geminiApiKey: ''
    });

    const [isEditing, setIsEditing] = useState(!profile);

    useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'dailyTimeAvailability'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
        alert('Profile saved successfully!');
    };

    if (!isEditing && profile) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">Goal</span>
                        <span className="font-bold text-gray-900 capitalize">{profile.goal.replace('_', ' ')}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">Region</span>
                        <span className="font-bold text-gray-900 capitalize">{profile.region.replace('_', ' ')}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">Diet</span>
                        <span className="font-bold text-gray-900 capitalize">{profile.dietaryPreference.replace('_', ' ')}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="block text-gray-500 text-xs uppercase tracking-wide">Workout</span>
                        <span className="font-bold text-gray-900 capitalize">{profile.workoutPreference}</span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3">Stats</h3>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{profile.age} yrs</span>
                        <span>{profile.height} cm</span>
                        <span>{profile.weight} kg</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{profile ? 'Edit Profile' : 'Setup Your Profile'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                    <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                    >
                        <option value="fat_loss">Fat Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleChange}
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                    >
                        <option value="sedentary">Sedentary (Office job)</option>
                        <option value="lightly_active">Lightly Active (1-2 days/week)</option>
                        <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                        <option value="very_active">Very Active (6-7 days/week)</option>
                        <option value="extra_active">Extra Active (Physical job)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Workout Place</label>
                        <select
                            name="workoutPreference"
                            value={formData.workoutPreference}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                        >
                            <option value="home">Home</option>
                            <option value="gym">Gym</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diet Type</label>
                        <select
                            name="dietaryPreference"
                            value={formData.dietaryPreference}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                        >
                            <option value="veg">Vegetarian</option>
                            <option value="non_veg">Non-Vegetarian</option>
                            <option value="egg">Eggetarian</option>
                            <option value="vegan">Vegan</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region (for Diet)</label>
                    <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                    >
                        <option value="north_india">North India</option>
                        <option value="south_india">South India</option>
                        <option value="east_india">East India</option>
                        <option value="west_india">West India</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Gemini API Key (Optional)</label>
                    <input
                        type="password"
                        name="geminiApiKey"
                        value={formData.geminiApiKey || ''}
                        onChange={handleChange}
                        placeholder="AIzaSy..."
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required for AI generation. Stored locally.</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg mt-4"
                >
                    Save Profile
                </button>
            </form>
        </div>
    );
};

export default ProfileSetup;
