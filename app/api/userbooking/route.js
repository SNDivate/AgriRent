import { NextResponse } from "next/server";
import Equipment from "@/models/equipment";
import User from "@/models/user";
import Booking from "@/models/booking";
import { connectMongoDB } from "@/libs/connectDb";

export async function POST(req) {
    await connectMongoDB();
    try {
        const { id } = await req.json(); // User ID of the renter
        console.log("User ID:", id);
        
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        // Fetch all bookings made by this user (equipment they've rented)
        const userBookings = await Booking.find({ userId: user._id })
            .populate("equipmentId")
            .populate({
                path: "equipmentId",
                populate: {
                    path: "userId",
                    model: "User",
                    select: "name email" // Only select necessary owner fields
                }
            });
        
        if (!userBookings || userBookings.length === 0) {
            return NextResponse.json({ bookings: [] }, { status: 200 });
        }
        
        console.log("Fetched User Booking History:", userBookings);
        
        // Format the booking data with equipment and owner details
        const formattedBookings = userBookings.map(booking => ({
            bookingId: booking._id.toString(),
            status: booking.status || "Confirmed", // Include booking status if available
            equipment: booking.equipmentId
                ? {
                    id: booking.equipmentId._id.toString(),
                    name: booking.equipmentId.name,
                    description: booking.equipmentId.description,
                    rentalPrice: booking.equipmentId.rentalPrice,
                    image: booking.equipmentId.image?.image_url || "/no-image.png",
                }
                : null,
            owner: booking.equipmentId && booking.equipmentId.userId
                ? {
                    id: booking.equipmentId.userId._id.toString(),
                    name: booking.equipmentId.userId.name,
                    email: booking.equipmentId.userId.email,
                }
                : null,
            rentalStartDate: booking.rentalStartDate,
            rentalEndDate: booking.rentalEndDate,
            totalCost: booking.totalCost,
            createdAt: booking.createdAt
        }));
        
        return NextResponse.json({
            bookings: formattedBookings
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error fetching user booking history:", error);
        return NextResponse.json({ error: "Failed to fetch booking history" }, { status: 500 });
    }
}