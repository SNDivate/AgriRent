export default function AddEquipmentForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-2/3">
        <h2 className="text-2xl font-semibold mb-4">Add Equipment</h2>
        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-medium">Name</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea className="w-full p-2 border rounded"></textarea>
          </div>

          {/* Condition & Rental Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Condition</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Rental Price</label>
              <input type="number" className="w-full p-2 border rounded" />
            </div>
          </div>

          {/* Owner Name & Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Owner Name</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Contact Number</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium">Address</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>

          {/* Image Upload */}
          <div className="border p-4 text-center cursor-pointer rounded-lg">
            <label className="block font-medium">Upload Equipment Image</label>
            <input type="file" className="w-full mt-2" />
          </div>

          {/* Availability Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Availability Start</label>
              <input type="date" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block font-medium">Availability End</label>
              <input type="date" className="w-full p-2 border rounded" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
// "use client";

// import React, { useState } from "react";
// import {
//   Button,
//   Input,
//   Textarea,
//   Select,
//   SelectItem,
// } from "@nextui-org/react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useDropzone } from "react-dropzone";
// import { motion } from "framer-motion";
// import { toast } from "sonner";

// export default function EquipmentPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     condition: "",
//     rentalPrice: "",
//     ownerName: "",
//     contactNumber: "",
//     address: "",
//     image: null,
//     availabilityStart: "",
//     availabilityEnd: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   if (status === "unauthenticated") {
//     router.push("/login");
//     return null;
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onDrop = (acceptedFiles) => {
//     setFormData((prev) => ({ ...prev, image: acceptedFiles[0] }));
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append("userId", session.user.id);
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === "image" && value instanceof File) {
//           formDataToSend.append(key, value);
//         } else {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch("/api/newequipment", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add equipment");
//       }
//       toast.success("Equipment added successfully!");
//       setFormData({
//         name: "",
//         description: "",
//         condition: "",
//         rentalPrice: "",
//         ownerName: "",
//         contactNumber: "",
//         address: "",
//         image: null,
//         availabilityStart: "",
//         availabilityEnd: "",
//       });
//       router.refresh();
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="container mx-auto px-6 py-8 max-w-3xl"
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="text-2xl font-bold mb-6 text-center">Equipment Management</h1>
//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
//         <div className="grid grid-cols-2 gap-4">
//           <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
//           <Input label="Rental Price" name="rentalPrice" type="number" value={formData.rentalPrice} onChange={handleInputChange} required />
//         </div>
//         <Textarea label="Description" name="description" value={formData.description} onChange={handleInputChange} required />
//         <div className="grid grid-cols-2 gap-4">
//           <Input label="Owner Name" name="ownerName" value={formData.ownerName} onChange={handleInputChange} required />
//           <Input label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required />
//         </div>
//         <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
//         <Select label="Condition" name="condition" value={formData.condition} onChange={(value) => setFormData((prev) => ({ ...prev, condition: value.target.value || value }))} required>
//           <SelectItem key="new" value="new">New</SelectItem>
//           <SelectItem key="used" value="used">Used</SelectItem>
//           <SelectItem key="damaged" value="damaged">Damaged</SelectItem>
//         </Select>
//         <div {...getRootProps()} className="border-2 border-dashed p-4 text-center">
//           <input {...getInputProps()} />
//           {isDragActive ? <p>Drop the image here...</p> : <p>Add Files if available</p>}
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <Input type="datetime-local" label="Availability Start" name="availabilityStart" value={formData.availabilityStart} onChange={handleInputChange} required />
//           <Input type="datetime-local" label="Availability End" name="availabilityEnd" value={formData.availabilityEnd} onChange={handleInputChange} required />
//         </div>
//         <Button type="submit" color="primary" isLoading={isLoading} className="w-full">Add Equipment</Button>
//       </form>
//     </motion.div>
//   );
// }
