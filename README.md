# Pair Trade Terminal

A modern, institutional-grade web interface for analyzing stock pair spreads with dynamic volatility scaling.

## Features
- **Pair Analysis**: Compare any two assets (e.g., TCS vs WIPRO).
- **Dynamic Scaling**: Automatically calculates the volatility scaling factor (based on High-Low range).
- **Spread Visualization**: Interactive candlestick chart of the spread `(Short * Factor) - Long`.
- **Modern UI**: Dark mode, glassmorphism, and responsive design.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS & Modern Design Tokens
- **Charting**: Plotly.js
- **Data**: Yahoo Finance API (via `yahoo-finance2`)
- **Deployment**: Vercel Ready

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

3.  **Deploy to Vercel**
    - Push this repository to GitHub.
    - Import the project into Vercel.
    - Deploy! (No environment variables required for basic functionality).

## Logic
The app backend (`/api/analyze`) fetches historical data for the selected date range. It calculates the average volatility ratio between the two assets to determine the **Scaling Factor**. The spread is then computed as:
```
Spread = (Stock2_Price * ScalingFactor) - Stock1_Price
```
This data is sent to the frontend to render the candlestick chart.
