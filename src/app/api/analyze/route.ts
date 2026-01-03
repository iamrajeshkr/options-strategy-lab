import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function POST(request: Request) {
    try {
        const { stock1, stock2, startDate, endDate } = await request.json();

        if (!stock1 || !stock2 || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Helper to ensure ticker format (e.g., adding .NS for NSE)
        // Heuristic: If no suffix, assume NS for Indian context as per user history,
        // but check if data exists? No, yahoo-finance2 throws error or returns empty.
        // Let's just append .NS if no dot (simplistic but matches Python script behavior)
        const normalizeTicker = (ticker: string) => {
            const t = ticker.toUpperCase();
            return (t.includes('.') || t === 'SPY' || t === 'QQQ') ? t : `${t}.NS`;
        };

        const s1 = normalizeTicker(stock1);
        const s2 = normalizeTicker(stock2);

        // Fetch data
        const queryOptions = { period1: startDate, period2: endDate };

        // Using historical data
        // yahoo-finance2 returns array of objects { date, open, high, low, close, adjClose, volume }
        const [data1, data2] = await Promise.all([
            yahooFinance.historical(s1, queryOptions),
            yahooFinance.historical(s2, queryOptions)
        ]) as [any[], any[]];

        if (!data1.length || !data2.length) {
            return NextResponse.json({ error: 'No data found for one or both tickers' }, { status: 404 });
        }

        // Process and Align Data
        // Create map for O(1) lookup
        const map1 = new Map(data1.map(d => [d.date.toISOString().split('T')[0], d]));
        const map2 = new Map(data2.map(d => [d.date.toISOString().split('T')[0], d]));

        // Find intersection of dates
        const commonDates = data1
            .map(d => d.date.toISOString().split('T')[0])
            .filter(date => map2.has(date))
            .sort();

        if (commonDates.length === 0) {
            return NextResponse.json({ error: 'No overlapping data found' }, { status: 404 });
        }

        // Calculate Ratios for Scaling Factor
        const ratios: number[] = [];

        // Prepare aligned data arrays
        const alignedData = commonDates.map(date => {
            const d1 = map1.get(date)!;
            const d2 = map2.get(date)!;

            const vol1 = d1.high - d1.low;
            const vol2 = d2.high - d2.low;

            // Avoid division by zero
            if (vol2 !== 0) {
                ratios.push(vol1 / vol2);
            }

            return { date, d1, d2 };
        });

        if (ratios.length === 0) {
            return NextResponse.json({ error: 'Unable to calculate volatility ratios' }, { status: 500 });
        }

        // Scaling Factor
        const sumRatios = ratios.reduce((a, b) => a + b, 0);
        const scalingFactor = sumRatios / ratios.length;

        // Calculate Spread
        // Spread = (Stock2 * Factor) - Stock1
        const spreadData = alignedData.map(item => {
            const { date, d1, d2 } = item;

            const s2_open = d2.open;
            const s2_close = d2.close;
            const s1_open = d1.open;
            const s1_close = d1.close;

            const spread_open = (s2_open * scalingFactor) - s1_open;
            const spread_close = (s2_close * scalingFactor) - s1_close;

            const spread_high = Math.max(spread_open, spread_close);
            const spread_low = Math.min(spread_open, spread_close);

            return {
                date,
                open: spread_open,
                close: spread_close,
                high: spread_high, // Synthetic high/low
                low: spread_low
            };
        });

        return NextResponse.json({
            scalingFactor,
            spreadData,
            // Return raw aligned data for client-side recalculation
            alignedData,
            ticker1: s1,
            ticker2: s2
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
