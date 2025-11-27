/* analytics.js */
import { inject } from 'https://cdn.jsdelivr.net/npm/@vercel/analytics/+esm';
import { injectSpeedInsights } from 'https://cdn.jsdelivr.net/npm/@vercel/speed-insights/+esm';

// Initialize Web Analytics
inject();

// Initialize Speed Insights
injectSpeedInsights();

console.log("Vercel Analytics & Speed Insights loaded via ESM.");