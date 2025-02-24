import { NextResponse } from "next/server";
import Booking from "@/models/booking";
import Equipment from "@/models/equipment";
import User from "@/models/user";
import { connectMongoDB } from "@/libs/connectDb";

export async function GET(req, { params }) {
    await connectMongoDB();
    try {
        // ✅ Await params correctly
        const equipmentId = params?.equipmentId;

        if (!equipmentId) {
            return NextResponse.json({ error: "Equipment ID is required" }, { status: 400 });
        }

        // ✅ Check if the equipment exists
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
        }

        // ✅ Fetch bookings for this equipment
        const bookings = await Booking.find({ equipmentId })
            .populate("userId", "name email")  // Populate user details
            .populate("equipmentId", "name image");  // Populate equipment details

        if (!bookings.length) {
            return NextResponse.json({ message: "No bookings found for this equipment", bookings: [] }, { status: 200 });
        }

        // ✅ Format response
        const formattedBookings = bookings.map((booking) => ({
            bookingId: booking._id.toString(),
            equipment: {
                id: booking.equipmentId?._id.toString(),
                name: booking.equipmentId?.name,
                image: booking.equipmentId?.image?.image_url || "/no-image.png",
            },
            rentedBy: {
                userId: booking.userId?._id.toString(),
                name: booking.userId?.name,
                email: booking.userId?.email,
            },
            rentalStartDate: booking.rentalStartDate,
            rentalEndDate: booking.rentalEndDate,
        }));

        return NextResponse.json({ bookings: formattedBookings }, { status: 200 });

    } catch (error) {
        console.error("Error fetching bookings for equipment:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
