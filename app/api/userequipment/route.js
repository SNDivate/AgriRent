import { NextResponse } from 'next/server';
import Equipment from '@/models/equipment';
import User from '@/models/user';
import { connectMongoDB } from '@/libs/connectDb';

export async function POST(req) {
    await connectMongoDB();
    try {
        const { id } = await req.json();
        console.log("User ID:", id);

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Log the equipment array for debugging
        console.log("User Equipment Array:", user.equipment);

        // Fetch the equipment associated with the user
        const equipmentRecords = await Equipment.find({ userId: user._id }); // Assuming userId in Equipment model
        console.log("Fetched Equipment Records:", equipmentRecords);

        return NextResponse.json(equipmentRecords);
    } catch (error) {
        console.error("Error fetching equipment records:", error);
        return NextResponse.json({ error: "Failed to fetch equipment records" }, { status: 500 });
    }
}
