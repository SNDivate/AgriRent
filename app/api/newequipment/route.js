import { NextResponse } from "next/server";
import Equipment from "@/models/equipment";
import User from "@/models/user";
import { connectMongoDB } from "@/libs/connectDb";
import { uploadImage } from "@/libs/uploadImage";

const validConditions = ["new", "used", "damaged"];

export async function POST(req) {
  console.log("trying");
  connectMongoDB();
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const condition = formData.get("condition");
    const rentalPrice = formData.get("rentalPrice");
    const ownerName = formData.get("ownerName");
    const contactNumber = formData.get("contactNumber");
    const address = formData.get("address");
    const availabilityStart = formData.get("availabilityStart");
    const availabilityEnd = formData.get("availabilityEnd");
    const userId = formData.get("userId");
    const image = formData.get("image");

    if (
      !name ||
      !description ||
      !condition ||
      !rentalPrice ||
      !ownerName ||
      !contactNumber ||
      !address ||
      !availabilityStart||
      !availabilityEnd ||
      !userId
    ) {
      throw new Error("One or more required fields are missing");
    }

    if (!validConditions.includes(condition.toLowerCase())) {
      throw new Error(`Invalid value for condition. Allowed values: ${validConditions.join(", ")}`);
    }

    const startDate = new Date(availabilityStart);
    const endDate = new Date(availabilityEnd);
    if (isNaN(startDate) || isNaN(endDate)) {
      throw new Error("Invalid date format for availabilityStartDate or availabilityEndDate");
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
          message: "The specified user does not exist",
          success: false,
        },
        { status: 404 }
      );
    }

    let imageUrl, publicId;
    if (image && image.name) {
      const uploadResult = await uploadImage(image, "equipment");
      imageUrl = uploadResult.url;
      publicId = uploadResult.public_id;
    }

  // In the equipmentData object, change the date field names:
const equipmentData = {
    name,
    description,
    condition,
    rentalPrice: parseFloat(rentalPrice),
    ownerName,
    contactNumber,
    address,
    availabilityStart: startDate,  // Changed from availabilityStartDate
    availabilityEnd: endDate,      // Changed from availabilityEndDate
    userId,
  };

    if (imageUrl && publicId) {
      equipmentData.image = { image_url: imageUrl, public_id: publicId };
    }

    const newEquipment = new Equipment(equipmentData);
    await newEquipment.save();

    return NextResponse.json(
      {
        message: "Equipment added successfully",
        equipment: newEquipment,
        success: true,
      },
      { status: 201 }
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