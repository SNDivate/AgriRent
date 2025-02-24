import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  
  equipmentId:{
    type:String,
    required:true,
    ref: 'Equipment',
 },
 userId:{
    type:String,
    required:true,
    ref: 'User',
 },
 rentalStartDate: {
  type: Date,
  required: true
},
rentalEndDate: {
  type: Date,
  required: true
}
},{
    timestamps: true,
    });


const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;





