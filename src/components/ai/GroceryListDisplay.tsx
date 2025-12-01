import React from 'react';
import { GroceryList } from '../../types/userProfile';

interface GroceryListDisplayProps {
    list: GroceryList;
}

const GroceryListDisplay: React.FC<GroceryListDisplayProps> = ({ list }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-6">
            <div className="bg-yellow-50 p-4 border-b border-yellow-100 flex justify-between items-center">
                <h3 className="font-bold text-yellow-900 flex items-center gap-2">
                    <span>🛒</span> Grocery List
                </h3>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-yellow-800 shadow-sm">
                    Est. Cost: ₹{list.totalEstimatedCost}
                </span>
            </div>

            <div className="divide-y divide-gray-100">
                {list.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300" />
                            <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.category} • {item.quantity}</div>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">₹{item.estimatedCost}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroceryListDisplay;
