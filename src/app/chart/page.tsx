"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SpreadChart from "@/components/SpreadChart";
import { Loader2 } from "lucide-react";

function ChartContent() {
    const searchParams = useSearchParams();
    const stock1 = searchParams.get("stock1");
    const stock2 = searchParams.get("stock2");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!stock1 || !stock2 || !start || !end) {
            setError("Missing parameters");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        stock1,
                        stock2,
                        startDate: start,
                        endDate: end,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setResult(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [stock1, stock2, start, end]);

    if (loading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-black p-4">
            {result && result.spreadData ? (
                <SpreadChart
                    data={result.spreadData}
                    title={`Spread: (${result.ticker2} × ${result.scalingFactor.toFixed(2)}) - ${result.ticker1}`}
                />
            ) : result ? (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <p>Data format mismatch. Please wait for the deployment to finish or refresh.</p>
                </div>
            ) : null}
        </div>
    );
}

export default function ChartPage() {
    return (
        <Suspense fallback={<div className="bg-black h-screen text-white">Loading...</div>}>
            <ChartContent />
        </Suspense>
    );
}
