import React, { useEffect, useState } from 'react';
import { BarChart2, CheckCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export default function ResultsChart() {
    const [resultsData, setResultsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResults = async () => {
        try {
            const basePath = import.meta.env.BASE_URL;
            const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
            const res = await fetch(normalizedBase + '/api/results');
            if (res.ok) {
                const data = await res.json();
                // Sort by highest vote count
                const sorted = data.sort((a, b) => b.votes - a.votes);
                setResultsData(sorted);
            }
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
        // Optional: Poll every 30 seconds
        const interval = setInterval(fetchResults, 30000);
        return () => clearInterval(interval);
    }, []);

    const totalVotes = resultsData.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div>
            <div className="bg-[#d4edda] border border-[#c3e6cb] rounded-md p-4 text-[#155724] mb-6 flex items-start shadow-sm">
                <CheckCircle className="mr-3 flex-shrink-0 mt-0.5" size={24} />
                <div>
                    <h4 className="font-bold text-lg">Acknowledgment</h4>
                    <p className="text-sm">Your response has been securely recorded. Thank you for your participation.</p>
                </div>
            </div>

            <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#f8f9fa] border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center">
                    <h3 className="text-md md:text-lg font-bold text-[#003366] flex items-center">
                        <BarChart2 className="mr-2" size={20} /> Live Constituency Tally
                    </h3>
                    <div className="flex items-center space-x-3">
                        <button onClick={fetchResults} className="text-gray-500 hover:text-[#003366] transition-colors" title="Refresh">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-sm uppercase tracking-wider font-bold animate-pulse">Live Data</span>
                    </div>
                </div>

                <div className="p-4 md:p-6">
                    {loading && resultsData.length === 0 ? (
                        <div className="h-80 flex items-center justify-center text-gray-500">Loading live data...</div>
                    ) : (
                        <>
                            <div className="h-64 sm:h-80 w-full mb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={resultsData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                        <XAxis dataKey="name" tick={{ fill: '#333', fontWeight: 'bold', fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} width={65} tickFormatter={(v) => v.toLocaleString()} />
                                        <Tooltip
                                            cursor={{ fill: '#f4f6f9' }}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0', fontWeight: 'bold' }}
                                            formatter={(value) => [value.toLocaleString(), 'Votes']}
                                        />
                                        <Bar dataKey="votes" maxBarSize={60} radius={[4, 4, 0, 0]}>
                                            {resultsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Formal Results Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200 text-sm">
                                    <thead>
                                        <tr className="bg-[#e9ecef] text-[#003366]">
                                            <th className="border border-gray-200 p-2 md:p-3 text-left">Party</th>
                                            <th className="border border-gray-200 p-2 md:p-3 text-right">Total Verified Votes</th>
                                            <th className="border border-gray-200 p-2 md:p-3 text-right hidden sm:table-cell">Vote Share (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultsData.map((data) => {
                                            const percentage = totalVotes === 0 ? '0.0' : ((data.votes / totalVotes) * 100).toFixed(1);
                                            return (
                                                <tr key={data.name} className="hover:bg-gray-50 transition-colors">
                                                    <td className="border border-gray-200 p-2 md:p-3 font-bold flex items-center">
                                                        <div className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 rounded-sm border border-gray-300" style={{ backgroundColor: data.color }}></div>
                                                        {data.name}
                                                    </td>
                                                    <td className="border border-gray-200 p-2 md:p-3 text-right font-mono text-base">{data.votes.toLocaleString()}</td>
                                                    <td className="border border-gray-200 p-2 md:p-3 text-right font-mono text-gray-600 hidden sm:table-cell">{percentage}%</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-gray-100 font-bold text-[#003366]">
                                            <td className="border border-gray-200 p-2 md:p-3 text-right">Total:</td>
                                            <td className="border border-gray-200 p-2 md:p-3 text-right font-mono text-base">{totalVotes.toLocaleString()}</td>
                                            <td className="border border-gray-200 p-2 md:p-3 text-right hidden sm:table-cell">100%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
