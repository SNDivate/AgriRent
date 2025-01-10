import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ["new", "used", "damaged"], // Update to match the API validation
    },
    
    rentalPrice: {
      type: Number,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      image_url:{
          type:String
      },
      public_id:{
          type:String
      }
    },
    availabilityStart: { type: Date, required: true }, // Start of availability period
    availabilityEnd: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Equipment =
  mongoose.models.Equipment || mongoose.model("Equipment", equipmentSchema);

export default Equipment;
