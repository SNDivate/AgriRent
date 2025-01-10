import { NextResponse } from 'next/server';
import User from '@/app/models/user';
import Equipment from '@/models/equipment';
import { connectMongoDB } from '@/libs/connectDb';

export async function POST(req) {
    await connectMongoDB(); // Ensure MongoDB connection
    try {
        const { userId } = await req.json(); // Extract `userId` from the request body
        console.log("User ID:", userId);

        // Find the user by ID (correct the usage of findById)
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the user has equipment
        if (!user.equipment || user.equipment.length === 0) {
            return NextResponse.json({ error: "No equipment associated with this user" }, { status: 404 });
        }

        // Fetch the equipment associated with the user
        const equipmentRecords = await Equipment.find({ _id: { $in: user.equipment } }); // Assuming user.equipment contains equipment IDs
        console.log("Fetched Equipment Records:", equipmentRecords);

        return NextResponse.json(equipmentRecords); // Return the equipment records
    } catch (error) {
        console.error("Error fetching equipment records:", error);
        return NextResponse.json({ error: "Failed to fetch equipment records" }, { status: 500 });
    }
}
