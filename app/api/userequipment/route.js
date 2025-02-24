import { NextResponse } from "next/server";
import Equipment from "@/models/equipment";
import User from "@/models/user";
import Booking from "@/models/booking";
import { connectMongoDB } from "@/libs/connectDb";

export async function POST(req) {
    await connectMongoDB();
    try {
        const { id } = await req.json(); // Owner/User ID
        console.log("Owner ID:", id);

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch all equipment owned by this user
        const ownedEquipment = await Equipment.find({ userId: user._id });

        if (!ownedEquipment || ownedEquipment.length === 0) {
            return NextResponse.json({ equipment: [], bookings: [] }, { status: 200 });
        }

        console.log("Fetched Equipment Records:", ownedEquipment);

        // Get all equipment IDs owned by the user
        const equipmentIds = ownedEquipment.map(eq => eq._id);

        // Fetch bookings where the equipment belongs to this owner
        const bookings = await Booking.find({ equipmentId: { $in: equipmentIds } })
            .populate("equipmentId")
            .populate("userId");

        console.log("Fetched Bookings:", bookings);

        // ✅ Ensure that response data is always an array and check for missing IDs
        const formattedBookings = bookings.map(booking => ({
            bookingId: booking._id,
            equipment: booking.equipmentId
                ? {
                    id: booking.equipmentId._id.toString(),
                    name: booking.equipmentId.name,
                    image: booking.equipmentId.image?.image_url || "/no-image.png",
                }
                : null, // Handle case where equipment might be missing
            rentedBy: booking.userId
                ? {
                    userId: booking.userId._id.toString(),
                    name: booking.userId.name,
                    email: booking.userId.email,
                }
                : null, // Handle case where user might be missing
            rentalStartDate: booking.rentalStartDate,
            rentalEndDate: booking.rentalEndDate,
        }));

        // ✅ Format Equipment Data
        const formattedEquipment = ownedEquipment.map(equip => ({
            equipmentId: equip._id.toString(),
            name: equip.name,
            description: equip.description,
            condition: equip.condition,
            rentalPrice: equip.rentalPrice,
            ownerName: equip.ownerName,
            contactNumber: equip.contactNumber,
            address: equip.address,
            image: equip.image?.image_url || "/no-image.png",
            availabilityStart: equip.availabilityStart,
            availabilityEnd: equip.availabilityEnd,
        }));

        return NextResponse.json({
            equipment: formattedEquipment,
            bookings: formattedBookings,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching equipment and bookings:", error);
        return NextResponse.json({ error: "Failed to fetch equipment and bookings" }, { status: 500 });
    }
}
