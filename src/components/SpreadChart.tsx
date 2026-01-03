"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Layout } from "plotly.js";
import { Maximize2, ExternalLink } from "lucide-react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface SpreadChartProps {
    data: {
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
    }[];
    title: string;
    meta?: {
        stock1: string;
        stock2: string;
        startDate: string;
        endDate: string;
    };
}

const SpreadChart: React.FC<SpreadChartProps> = ({ data, title, meta }) => {
    const dates = data.map((d) => d.date);
    const open = data.map((d) => d.open);
    const high = data.map((d) => d.high);
    const low = data.map((d) => d.low);
    const close = data.map((d) => d.close);

    const openNewTab = () => {
        if (!meta) return;
        const params = new URLSearchParams({
            stock1: meta.stock1,
            stock2: meta.stock2,
            start: meta.startDate,
            end: meta.endDate,
        });
        window.open(`/chart?${params.toString()}`, "_blank");
    };

    return (
        <div className="w-full h-[600px] bg-black/40 rounded-xl border border-white/10 p-4 shadow-2xl backdrop-blur-sm relative">
            {/* Header Actions */}
            {meta && (
                <button
                    onClick={openNewTab}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    title="Open in Full Screen (New Tab)"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>
            )}

            <Plot
                data={[
                    {
                        x: dates,
                        close: close,
                        decreasing: { line: { color: "#ff4d4d" } },
                        high: high,
                        increasing: { line: { color: "#00ff88" } },
                        line: { color: "rgba(31,119,180,1)" },
                        low: low,
                        open: open,
                        type: "candlestick",
                        xaxis: "x",
                        yaxis: "y",
                        name: "Spread",
                    },
                ]}
                layout={{
                    title: {
                        text: title,
                        font: { color: "#fff", size: 24, family: "Inter, sans-serif" },
                    },
                    dragmode: "zoom",
                    showlegend: false,
                    xaxis: {
                        rangeslider: { visible: false },
                        title: "Date",
                        gridcolor: "#333",
                        linecolor: "#555",
                        tickfont: { color: "#aaa" },
                        titlefont: { color: "#aaa" },
                        type: "date",
                    },
                    yaxis: {
                        autorange: true,
                        title: "Price Spread",
                        gridcolor: "#333",
                        linecolor: "#555",
                        tickfont: { color: "#aaa" },
                        titlefont: { color: "#aaa" },
                        type: "linear",
                    },
                    margin: { l: 50, r: 50, b: 50, t: 80 },
                    paper_bgcolor: "rgba(0,0,0,0)",
                    plot_bgcolor: "rgba(0,0,0,0)",
                    font: { family: "Inter, sans-serif" },
                    autosize: true,
                } as Partial<Layout>}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler={true}
                config={{ displayModeBar: true, displaylogo: false }}
            />
        </div>
    );
};

export default SpreadChart;
