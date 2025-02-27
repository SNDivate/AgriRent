import { NextResponse } from 'next/server';
import Equipment from '@/models/equipment';
import Booking from '@/models/booking';
import { connectMongoDB } from '@/libs/connectDb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    await connectMongoDB();
    
    // Get user session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
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
      (equipment) => {
        // Check if the equipment is not already booked
        const notBooked = !bookedEquipmentIds.includes(
          equipment._id instanceof ObjectId ? equipment._id.toString() : equipment._id
        );
        
        // Check if the ownerId exists and is not the current user's ID
        let notOwnedByCurrentUser = true;
        if (equipment.ownerId) {
          const ownerIdString = equipment.ownerId instanceof ObjectId 
            ? equipment.ownerId.toString() 
            : String(equipment.ownerId);
          
          notOwnedByCurrentUser = ownerIdString !== userId;
        }
        
        return notBooked && notOwnedByCurrentUser;
      }
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