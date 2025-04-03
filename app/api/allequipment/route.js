import { NextResponse } from 'next/server';
import Equipment from '@/models/equipment';
import Booking from '@/models/booking'; // Assuming you have a Booking model
import { connectMongoDB } from '@/libs/connectDb';

export async function GET(req) {
    await connectMongoDB(); // Ensure MongoDB connection
    
    try {
        // Fetch all equipment records with full details
        const equipmentRecords = await Equipment.find({});
        
        // If no equipment found
        if (!equipmentRecords || equipmentRecords.length === 0) {
            return NextResponse.json({ error: "No equipment found" }, { status: 404 });
        }
        
        // Fetch all bookings to determine equipment status
        const bookings = await Booking.find({
            // You might want to filter by active bookings only
            // For example: status: 'active'
        });
        
        // Create a map of equipment IDs to their bookings
        const bookingMap = {};
        bookings.forEach(booking => {
            if (booking.equipmentId) {
                if (!bookingMap[booking.equipmentId]) {
                    bookingMap[booking.equipmentId] = [];
                }
                bookingMap[booking.equipmentId].push(booking);
            }
        });
        
        // Enhance equipment records with booking information
        const enhancedEquipment = equipmentRecords.map(equipment => {
            const equipmentObj = equipment.toObject();
            const equipmentId = equipment._id.toString();
            
            // Add booking information
            equipmentObj.bookings = bookingMap[equipmentId] || [];
            equipmentObj.isBooked = equipmentObj.bookings.length > 0;
            
            return equipmentObj;
        });
        
        console.log(`Fetched ${enhancedEquipment.length} equipment records with booking details`);
        return NextResponse.json(enhancedEquipment);
        
    } catch (error) {
        console.error("Error fetching equipment records:", error);
        return NextResponse.json(
            { error: "Failed to fetch equipment records" },
            { status: 500 }
        );
    }
}