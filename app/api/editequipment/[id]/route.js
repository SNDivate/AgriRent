import { NextResponse } from "next/server";
import Equipment from "@/models/equipment";
import User from "@/models/user";
import { connectMongoDB } from "@/libs/connectDb";

const validConditions = ["new", "used", "damaged"];

export async function PUT(req, { params }) {  // ✅ Correct way to extract `params`
  try {
    await connectMongoDB();

    const equipmentId = params.id;  // ✅ Corrected ID extraction

    if (!equipmentId) {
      return NextResponse.json(
        { error: "Equipment ID is required", success: false },
        { status: 400 }
      );
    }

    const requestData = await req.json();

    // Find existing equipment
    const existingEquipment = await Equipment.findById(equipmentId);
    if (!existingEquipment) {
      return NextResponse.json(
        { error: "Equipment not found", success: false },
        { status: 404 }
      );
    }

    // Extract and validate fields
    const {
      name,
      description,
      condition,
      rentalPrice,
      ownerName,
      contactNumber,
      address,
      availabilityStart,
      availabilityEnd,
      userId,
    } = requestData;

    if (!name || !description || !condition || !rentalPrice || !ownerName ||
        !contactNumber || !address || !availabilityStart || !availabilityEnd || !userId) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    if (!validConditions.includes(condition.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid condition. Allowed values: ${validConditions.join(", ")}`, success: false },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(availabilityStart);
    const endDate = new Date(availabilityEnd);
    if (isNaN(startDate) || isNaN(endDate)) {
      return NextResponse.json(
        { error: "Invalid date format", success: false },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Prepare update data
    const equipmentData = {
      name,
      description,
      condition,
      rentalPrice: parseFloat(rentalPrice) || 0,
      ownerName,
      contactNumber,
      address,
      availabilityStart: startDate,
      availabilityEnd: endDate,
      userId,
    };

    // Update equipment
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      equipmentData,
      { new: true }
    );

    return NextResponse.json(
      { message: "Equipment updated successfully", equipment: updatedEquipment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
