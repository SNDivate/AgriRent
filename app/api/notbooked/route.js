import { NextResponse } from 'next/server';
import Equipment from '@/models/equipment';
import Booking from '@/models/booking';
import { connectMongoDB } from '@/libs/connectDb';

export async function GET() {
    try {
        await connectMongoDB();
        
        const equipmentRecords = await Equipment.find({});
        
        if (!equipmentRecords || equipmentRecords.length === 0) {
            return NextResponse.json([]);
        }
        
        const bookedEquipmentIds = await Booking.distinct("equipmentId");
        
        const availableEquipment = equipmentRecords.filter(
            (equipment) => !bookedEquipmentIds.includes(equipment._id.toString())
        );
        
        return NextResponse.json(availableEquipment);
        
    } catch (error) {
        console.error("Error fetching available equipment records:", error);
        return NextResponse.json(
            { error: "Failed to fetch available equipment records" }, 
            { status: 500 }
        );
    }
}