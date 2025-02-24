import { NextResponse } from 'next/server';
import Equipment from '@/models/equipment';
import Booking from '@/models/booking';
import { connectMongoDB } from '@/libs/connectDb';

export async function GET(req) {
    try {
        await connectMongoDB();

        // Extract userId from request headers (assuming it's sent in headers)
        const userId = req.headers.get("user-id");
        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" }, 
                { status: 400 }
            );
        }

        // Fetch all equipment
        const equipmentRecords = await Equipment.find({});

        if (!equipmentRecords || equipmentRecords.length === 0) {
            return NextResponse.json([]);
        }

        // Get booked equipment IDs
        const bookedEquipmentIds = await Booking.distinct("equipmentId");

        // Filter available equipment that is not booked and not owned by the requesting user
        const availableEquipment = equipmentRecords.filter(
            (equipment) => 
                !bookedEquipmentIds.includes(equipment._id.toString()) &&
                equipment.ownerId.toString() !== userId
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
