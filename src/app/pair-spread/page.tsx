"use client";

import { useState } from "react";
import SpreadChart from "@/components/SpreadChart";
import { ArrowRight, Activity, Calendar, Search } from "lucide-react";

export default function PairSpreadPage() {
  const [stock1, setStock1] = useState("TCS");
  const [stock2, setStock2] = useState("WIPRO");
  const [startDate, setStartDate] = useState("2025-07-01");
  const [endDate, setEndDate] = useState("2026-01-01");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock1, stock2, startDate, endDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl sticky top-8">
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

              {result && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Scaling Factor</span>
                    <span className="text-[#00ff88] font-mono font-bold text-lg">
                      {result.scalingFactor.toFixed(4)}x
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Calculated via {result.ticker2} / {result.ticker1} volatility ratio.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3 min-h-[500px]">
            {result ? (
              <SpreadChart
                data={result.spreadData}
                title={`Spread Analysis: (${result.ticker2} × ${result.scalingFactor.toFixed(2)}) - ${result.ticker1}`}
                meta={{
                  stock1: stock1,
                  stock2: stock2,
                  startDate: startDate,
                  endDate: endDate
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
