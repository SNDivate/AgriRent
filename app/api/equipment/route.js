import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Equipment from "@/models/equipment";
import { connectMongoDB } from "@/libs/connectDb";

export async function POST(req) {
  try {
    await connectMongoDB();
    
    const body = await req.json();
    
    if (!body.equipmentId) {
      return NextResponse.json(
        {
          error: "Equipment ID is required",
          message: "Please provide a valid equipment ID",
          success: false,
        },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(body.equipmentId)) {
      return NextResponse.json(
        {
          error: "Invalid Equipment ID",
          message: "The provided equipment ID is not valid",
          success: false,
        },
        { status: 400 }
      );
    }
    
    const equipment = await Equipment.findById(body.equipmentId);
    
    if (!equipment) {
      return NextResponse.json(
        {
          error: "Equipment not found",
          message: "No equipment found with the provided ID",
          success: false,
        },
        { status: 404 }
      );
    }

    // Process the image URL based on your schema structure
    let imageUrl = null;
    if (equipment.image && equipment.image.image_url) {
      imageUrl = equipment.image.image_url;
    }

    return NextResponse.json(
      {
        success: true,
        equipment: {
          _id: equipment._id,
          name: equipment.name,
          description: equipment.description,
          image: imageUrl,
          condition: equipment.condition,
          rentalPrice: equipment.rentalPrice,
          ownerName: equipment.ownerName,
          address: equipment.address,
          contactNumber: equipment.contactNumber,
          availabilityStart: equipment.availabilityStart,
          availabilityEnd: equipment.availabilityEnd,
          userId: equipment.userId,
          createdAt: equipment.createdAt,
          updatedAt: equipment.updatedAt
        },
        message: "Equipment fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "An unexpected error occurred",
        success: false,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}