import { NextResponse } from 'next/server';
import Equipment from '@/models/equipment';
import { connectMongoDB } from '@/libs/connectDb';

export async function GET(req) {
    await connectMongoDB(); // Ensure MongoDB connection
    
    try {
        // Fetch all equipment records
        const equipmentRecords = await Equipment.find({});
        
        // If no equipment found
        if (!equipmentRecords || equipmentRecords.length === 0) {
            return NextResponse.json({ error: "No equipment found" }, { status: 404 });
        }

        console.log(`Fetched ${equipmentRecords.length} equipment records`);
        return NextResponse.json(equipmentRecords);

    } catch (error) {
        console.error("Error fetching equipment records:", error);
        return NextResponse.json(
            { error: "Failed to fetch equipment records" }, 
            { status: 500 }
        );
    }
}