import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/connectDb";
import Booking from "@/models/booking";
import Equipment from "@/models/equipment";

// POST: Create a new booking
export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { equipmentId, userId, rentalStartDate, rentalEndDate } = data;

        if (!equipmentId || !userId || !rentalStartDate || !rentalEndDate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Fetch equipment details
        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
        }

        // Validate rentalStartDate and rentalEndDate against availability
        const startDateObj = new Date(rentalStartDate);
        const endDateObj = new Date(rentalEndDate);

        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        if (
            startDateObj < new Date(equipment.availabilityStart) || 
            endDateObj > new Date(equipment.availabilityEnd) ||
            startDateObj > endDateObj
        ) {
            return NextResponse.json(
                { error: "Rental dates are outside the equipment's availability range or invalid" }, 
                { status: 400 }
            );
        }

        // Ensure the equipment is not already booked for the selected range
        const existingBooking = await Booking.findOne({
            equipmentId,
            $or: [
                { rentalStartDate: { $lte: endDateObj }, rentalEndDate: { $gte: startDateObj } }
            ]
        });

        if (existingBooking) {
            return NextResponse.json(
                { error: "Equipment is already booked for the selected dates" }, 
                { status: 400 }
            );
        }

        // Create booking
        const newBooking = new Booking({ equipmentId, userId, rentalStartDate, rentalEndDate });
        await newBooking.save();

        console.log("Booking Created Successfully:", newBooking);
        return NextResponse.json({ message: "Booking Created Successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: "Failed to Create Booking", details: error.message }, { status: 500 });
    }
}