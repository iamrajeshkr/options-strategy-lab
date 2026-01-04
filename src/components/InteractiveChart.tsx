"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, Time, CandlestickSeries } from 'lightweight-charts';
import { Maximize2 } from 'lucide-react';

interface InteractiveChartProps {
    data: {
        date: string;
        open: number;
        high: number;
        low: number;
        close: number;
    }[];
    title: string;
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
    meta?: {
        stock1: string;
        stock2: string;
        startDate: string;
        endDate: string;
        interval?: string;
    };
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ data, title, colors, meta }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors?.backgroundColor || 'transparent' },
                textColor: colors?.textColor || '#d1d5db',
                fontFamily: 'Inter, sans-serif',
            },
            width: chartContainerRef.current.clientWidth,
            height: 600,
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                borderColor: '#485c7b',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        // Format data for lightweight-charts
        // It expects { time: string | number, open: number, high: number, low: number, close: number }
        // Time must be sorted.
        const chartData = data.map(d => ({
            time: (new Date(d.date).getTime() / 1000) as Time, // Unix timestamp in seconds
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        })).sort((a, b) => (a.time as number) - (b.time as number));

        candlestickSeries.setData(chartData);

        // Fit content
        chart.timeScale().fitContent();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, colors]);

    const openNewTab = () => {
        if (!meta) return;
        const params = new URLSearchParams({
            stock1: meta.stock1,
            stock2: meta.stock2,
            start: meta.startDate,
            end: meta.endDate,
            interval: meta.interval || '1d'
        });
        window.open(`/chart?${params.toString()}`, "_blank");
    };

    return (
        <div className="w-full h-[600px] bg-black/40 rounded-xl border border-white/10 p-4 shadow-2xl backdrop-blur-sm relative flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                {meta && (
                    <button
                        onClick={openNewTab}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Open in Full Screen (New Tab)"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div ref={chartContainerRef} className="w-full h-full relative" />
        </div>
    );
};

export default InteractiveChart;
