"use client";

import { useState, useMemo } from "react";
import InteractiveChart from "@/components/InteractiveChart";
import { ArrowRight, Activity, Calendar, Search, RefreshCw, Minus, Plus } from "lucide-react";

export default function PairSpreadPage() {
    const [stock1, setStock1] = useState("TCS");
    const [stock2, setStock2] = useState("WIPRO");
    const [startDate, setStartDate] = useState("2025-07-01");
    const [endDate, setEndDate] = useState("2026-01-01");
    const [interval, setInterval] = useState("1d");
    const [loading, setLoading] = useState(false);
    const [apiResult, setApiResult] = useState<any>(null);
    const [customFactor, setCustomFactor] = useState<number | null>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setApiResult(null);
        setCustomFactor(null);

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock1, stock2, startDate, endDate, interval }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch data");
            }

            setApiResult(data);
            setCustomFactor(data.scalingFactor); // Initialize with calculated factor
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Recalculate spread on client side when factor changes
    const spreadChartData = useMemo(() => {
        if (!apiResult || customFactor === null) return null;

        return apiResult.alignedData.map((item: any) => {
            const { date, d1, d2 } = item;
            const s2_open = d2.open;
            const s2_close = d2.close;
            const s1_open = d1.open;
            const s1_close = d1.close;

            const spread_open = (s2_open * customFactor) - s1_open;
            const spread_close = (s2_close * customFactor) - s1_close;

            const spread_high = Math.max(spread_open, spread_close);
            const spread_low = Math.min(spread_open, spread_close);

            return {
                date,
                open: spread_open,
                close: spread_close,
                high: spread_high,
                low: spread_low
            };
        });
    }, [apiResult, customFactor]);

    const adjustFactor = (delta: number) => {
        if (customFactor === null) return;
        setCustomFactor(prev => Number((prev! + delta).toFixed(4)));
    };

    const resetFactor = () => {
        if (apiResult) {
            setCustomFactor(apiResult.scalingFactor);
        }
    };

    return (
        <main className="min-h-screen p-8 lg:p-12 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-12 flex flex-col items-center text-center">
                    <div className="bg-white/5 p-3 rounded-2xl mb-6 inline-flex border border-white/10 backdrop-blur-md">
                        <Activity className="text-[#00ff88] w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4 tracking-tight">
                        Pair Trade Terminal
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Institutional-grade relative value analysis. Visualize the spread between two assets with dynamic volatility scaling.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Controls Panel */}
                    <div className="lg:col-span-1 border-r border-white/10 pr-6 lg:pr-8 space-y-8">
                        <div className="glass-panel p-6 rounded-2xl space-y-6">
                            <form onSubmit={handleAnalyze} className="space-y-6">

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider ml-1">Pair Selection</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-400 ml-1">Long / Base</span>
                                            <input
                                                type="text"
                                                value={stock1}
                                                onChange={(e) => setStock1(e.target.value)}
                                                className="w-full input-field p-3 rounded-lg font-mono text-center uppercase"
                                                placeholder="TCS"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-400 ml-1">Short / Scale</span>
                                            <input
                                                type="text"
                                                value={stock2}
                                                onChange={(e) => setStock2(e.target.value)}
                                                className="w-full input-field p-3 rounded-lg font-mono text-center uppercase"
                                                placeholder="WIPRO"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider ml-1">Time Horizon</label>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full input-field p-3 pl-10 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full input-field p-3 pl-10 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <select
                                                value={interval}
                                                onChange={(e) => setInterval(e.target.value)}
                                                className="w-full input-field p-3 rounded-lg text-sm bg-[#0a0a0a] text-white border border-white/10"
                                            >
                                                <option value="1d">Daily</option>
                                                <option value="1h">Hourly</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary h-12 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="loading-spinner border-gray-800" />
                                    ) : (
                                        <>
                                            <span>Analyze Spread</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                        </div>

                        {/* Interactive Scaling Controls */}
                        {apiResult && customFactor !== null && (
                            <div className="glass-panel p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs text-[#00ff88] uppercase font-bold tracking-wider">Scaling Factor</label>
                                    <button onClick={resetFactor} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded transition-colors">
                                        <RefreshCw className="w-3 h-3" /> Reset
                                    </button>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => adjustFactor(-0.01)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <div className="flex-1 text-center">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={customFactor}
                                            onChange={(e) => setCustomFactor(parseFloat(e.target.value))}
                                            className="w-full bg-transparent text-2xl font-mono font-bold text-center text-white focus:outline-none"
                                        />
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Active Multiplier</p>
                                    </div>

                                    <button
                                        onClick={() => adjustFactor(0.01)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-white/5 text-center">
                                    <p className="text-xs text-gray-500 mb-1">Calculated Suggestion</p>
                                    <p className="font-mono text-sm text-gray-300">{apiResult.scalingFactor.toFixed(4)}x</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart Area */}
                    <div className="lg:col-span-3 min-h-[500px]">
                        {spreadChartData ? (
                            <InteractiveChart
                                data={spreadChartData}
                                title={`Spread Analysis: (${apiResult.ticker2} × ${customFactor?.toFixed(2)}) - ${apiResult.ticker1} `}
                                meta={{
                                    stock1: stock1,
                                    stock2: stock2,
                                    startDate: startDate,
                                    endDate: endDate,
                                    interval: interval
                                }}
                            />
                        ) : (
                            <div className="h-full glass-panel rounded-2xl flex flex-col items-center justify-center text-gray-600 space-y-4 min-h-[600px]">
                                <Search className="w-16 h-16 opacity-20" />
                                <p className="text-lg">Select assets and calculate to view the spread.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
