import Link from "next/link";
import { Activity, TrendingUp, BarChart3, ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen p-8 lg:p-12 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col items-center text-center">
          <div className="bg-white/5 p-3 rounded-2xl mb-6 inline-flex border border-white/10 backdrop-blur-md">
            <BarChart3 className="text-[#00ff88] w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4 tracking-tight">
            Terminal Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Select a financial tool to begin your analysis.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature Card: Pair Trade */}
          <Link href="/pair-spread" className="group">
            <div className="glass-panel p-8 rounded-2xl h-full transition-all duration-300 hover:bg-white/5 hover:border-[#00ff88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-[#00ff88] -translate-x-4 group-hover:translate-x-0 transition-transform" />
              </div>

              <div className="w-12 h-12 bg-[#00ff88]/10 rounded-xl flex items-center justify-center mb-6 text-[#00ff88]">
                <Activity className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Pair Spread Analysis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Visualize relative value spreads between two assets with dynamic volatility scaling.
              </p>
            </div>
          </Link>

          {/* Placeholder Card */}
          <div className="glass-panel p-8 rounded-2xl h-full border-dashed border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Option Scanner</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Coming soon. Scan option chains for probabilistic edge.
            </p>
            <span className="inline-block mt-4 text-[10px] uppercase tracking-wider font-bold bg-white/10 px-2 py-1 rounded text-gray-300">In Development</span>
          </div>

        </div>
      </div>
    </main>
  );
}
