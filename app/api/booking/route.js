import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/connectDb";
import Booking from "@/models/booking";
import Equipment from "@/models/equipment";

// POST: Create a new booking
export async function POST(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { equipmentId, userId, rentalDate } = data;

        if (!equipmentId || !userId || !rentalDate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Fetch equipment details
        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
        }

        // Validate rentalDate against availability
        const rentalDateObj = new Date(rentalDate);
        if (
            rentalDateObj < new Date(equipment.availabilityStart) || 
            rentalDateObj > new Date(equipment.availabilityEnd)
        ) {
            return NextResponse.json(
                { error: "Rental date is outside the equipment's availability range" }, 
                { status: 400 }
            );
        }

        // Create booking
        const newBooking = new Booking({ equipmentId, userId, rentalDate });
        await newBooking.save();

        console.log("Booking Created Successfully:", newBooking);
        return NextResponse.json({ message: "Booking Created Successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: "Failed to Create Booking" }, { status: 500 });
    }
}

// GET: Fetch bookings (all or specific user)
export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        let bookings;
        if (userId) {
            // Fetch bookings specific to a user
            bookings = await Booking.find({ userId }).populate("equipmentId").populate("userId");

            // If no bookings are found for the user, return an empty array instead of an error
            if (!bookings.length) {
                return NextResponse.json([], { status: 200 }); // Return empty array with a 200 status
            }
        } else {
            // Fetch all bookings if no userId is provided
            bookings = await Booking.find().populate("equipmentId").populate("userId");
        }

        console.log("Fetched Bookings Successfully:", bookings);
        return NextResponse.json(bookings); // Return fetched bookings
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Failed to Fetch Bookings" }, { status: 500 });
    }
}


// PUT: Update a booking
export async function PUT(req) {
    try {
        await connectMongoDB();
        const data = await req.json();
        const { id, equipmentId, userId, rentalDate } = data;

        if (!id) {
            return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { equipmentId, userId, rentalDate },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        console.log("Booking Updated Successfully:", updatedBooking);
        return NextResponse.json({ message: "Booking Updated Successfully", booking: updatedBooking });
    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json({ error: "Failed to Update Booking" }, { status: 500 });
    }
}

// DELETE: Delete a booking
export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
        }

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        console.log("Booking Deleted Successfully:", deletedBooking);
        return NextResponse.json({ message: "Booking Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        return NextResponse.json({ error: "Failed to Delete Booking" }, { status: 500 });
    }
}
