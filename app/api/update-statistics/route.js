import { NextResponse } from 'next/server';
import Statistics from '@/models/Statistics';
import connectDB from '@/dbConfig';

const RATES_DATA = [
    { "country": "United States", "rate_per_1000_views": 22.00 },
    { "country": "India", "rate_per_1000_views": 10.00 },
    { "country": "Rest of World", "rate_per_1000_views": 5.00 }
];

export async function POST(request) {
    try {
        await connectDB();

        const { userEmail, location, is_proper_view = true } = await request.json();

        let statistics = await Statistics.findOne({ userEmail });

        if (!statistics) {
            statistics = await Statistics.create({ userEmail });
        }

        const locationKey = location.split('/')[0] || 'Rest of World';
        const rateEntry = RATES_DATA.find(rate => rate.country.includes(locationKey)) || RATES_DATA.find(rate => rate.country === 'Rest of World');
        
        const cpm = rateEntry.rate_per_1000_views;

        statistics.averageCPM = cpm;

        statistics.totalImpressions += 1;

        if (is_proper_view) {
            statistics.totalProperViews++;
            statistics.totalEarnings += cpm / 1000;
        }

        await statistics.save();

        return NextResponse.json({ statistics }, { status: 200 });
    } catch (error) {
        console.error('Error processing update-statistics request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
