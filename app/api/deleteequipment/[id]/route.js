import { NextResponse } from "next/server";
import Equipment from "@/models/equipment";
import { connectMongoDB } from "@/libs/connectDb";

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();

    const equipmentId = params?.id;//✅ Extract equipment ID

    if (!equipmentId) {
      return NextResponse.json(
        { error: "Equipment ID is required", success: false },
        { status: 400 }
      );
    }

    console.log("Deleting Equipment ID:", equipmentId);

    // Convert equipmentId to a valid MongoDB ObjectId format
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return NextResponse.json(
        { error: "Invalid Equipment ID format", success: false },
        { status: 400 }
      );
    }

    // Check if the equipment exists
    const existingEquipment = await Equipment.findById(equipmentId);
    if (!existingEquipment) {
      return NextResponse.json(
        { error: "Equipment not found", success: false },
        { status: 404 }
      );
    }

    // Delete the equipment from the database
    await Equipment.findByIdAndDelete(equipmentId);

    return NextResponse.json(
      { message: "Equipment deleted successfully", success: true },
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
