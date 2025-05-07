"use client";

import { useRouter } from "next/navigation";

const AuditorHomeAdjusted = () => {
    const router = useRouter();

    const handleEditFinancials = () => router.push("/user/financials");
    const handleDataVisualizer = () => router.push("/user/visualizer");
    const handleForecastData = () => router.push("/user/forecast");

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
            {/* Edit Income Statement & Balance Sheet */}
            <div 
                className="p-6 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={handleEditFinancials}
            >
                <h2 className="text-xl font-bold text-gray-700">Edit Income Statement & Balance Sheet</h2>
                <p className="text-gray-500 mt-2">Manage financial records efficiently.</p>
            </div>

            <div 
                className="p-6 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={handleDataVisualizer}
            >
                <h2 className="text-xl font-bold text-gray-700">Data Visualizers</h2>
                <p className="text-gray-500 mt-2">View financial trends and insights visually.</p>
            </div>

            {/* Forecasted Data */}
            <div 
                className="p-6 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={handleForecastData}
            >
                <h2 className="text-xl font-bold text-gray-700">Forecasted Data</h2>
                <p className="text-gray-500 mt-2">Analyze predicted financial trends.</p>
            </div>
        </div>
    );
};

export default AuditorHomeAdjusted;
