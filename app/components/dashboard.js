"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Divider,
  Input,
  Chip,
  Tabs,
  Tab,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";

// Equipment Card Component
// Equipment Card Component
function EquipmentCard({ equipment, onSelect }) {
  const handleButtonClick = (event) => {
    // Ensure event exists before trying to use stopPropagation
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }
    // Call onSelect with the equipment data
    onSelect(equipment);
  };

  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(equipment)}
    >
      <CardHeader className="flex gap-3">
        <div className="relative w-24 h-24">
          {equipment.image ? (
            <Image
              alt={equipment?.name || "Equipment"}
              src={equipment.image || "/no-image.png"}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-lg">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{equipment.name}</p>
          <Chip color={equipment.isBooked ? "danger" : "success"} size="sm" variant="flat">
            {equipment.isBooked ? "Booked" : "Available"}
          </Chip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-sm text-default-600 line-clamp-2">
          {equipment.description || "No description available"}
        </p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">₹{equipment.rentalPrice || 0}/day</p>
        <Button 
          color="primary" 
          size="sm" 
          onPress={handleButtonClick} // Using onPress instead of onClick for NextUI
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

// Equipment Detail Panel Component
function EquipmentDetailPanel({ equipment, onClose, onDelete, onUpdate, onRefresh }) {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    console.log("Equipment detail effect running, equipment:", equipment);
    
    // Use equipmentId instead of _id
    if (equipment && equipment.equipmentId) {
      console.log("Calling fetchBookings for equipment:", equipment.equipmentId);
      fetchBookings();
    } else {
      console.log("Equipment not available yet, not fetching bookings");
    }
  }, [equipment]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Use equipmentId instead of _id
      if (!equipment || !equipment.equipmentId) {
        console.log("Equipment or equipment ID is undefined, skipping fetch");
        setBookings([]);
        return;
      }
      
      // Log the URL we're fetching from - use equipmentId instead of _id
      console.log("Fetching from URL:", `/api/userequipment/${equipment.equipmentId}`);
      
      const response = await fetch(`/api/userequipment/${equipment.equipmentId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      // Rest of your function remains the same
      console.log("Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      
      const data = await response.json();
      console.log("Raw response data:", data);
      
      if (data.bookings && Array.isArray(data.bookings)) {
        console.log("Found bookings:", data.bookings.length);
        setBookings(data.bookings);
      } else {
        console.log("No valid bookings in the response:", data);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.message || "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields based on API requirements
    const requiredFields = [
      "name", 
      "description", 
      "condition", 
      "rentalPrice", 
      "ownerName", 
      "contactNumber", 
      "address", 
      "availabilityStart", 
      "availabilityEnd", 
      "userId"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    
    // Validate condition field
    const validConditions = ["new", "used", "damaged"];
    if (formData.condition && !validConditions.includes(formData.condition.toLowerCase())) {
      newErrors.condition = `Invalid condition. Allowed values: ${validConditions.join(", ")}`;
    }
    
    // Validate rental price is a number
    if (formData.rentalPrice && isNaN(parseFloat(formData.rentalPrice))) {
      newErrors.rentalPrice = "Rental price must be a number";
    }
    
    // Validate dates
    if (formData.availabilityStart && isNaN(new Date(formData.availabilityStart).getTime())) {
      newErrors.availabilityStart = "Invalid date format";
    }
    
    if (formData.availabilityEnd && isNaN(new Date(formData.availabilityEnd).getTime())) {
      newErrors.availabilityEnd = "Invalid date format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!formData._id) {
      toast.error("Invalid equipment ID");
      return;
    }
  
    setIsSaving(true);
    try {
      // Create formatted data object with all required fields
      const formattedData = {
        ...formData,
        rentalPrice: parseFloat(formData.rentalPrice) || 0,
        // Format dates properly
        availabilityStart: formData.availabilityStart ? new Date(formData.availabilityStart).toISOString() : null,
        availabilityEnd: formData.availabilityEnd ? new Date(formData.availabilityEnd).toISOString() : null
      };
      
      // Log data being sent for debugging
      console.log("Saving equipment with ID:", formData._id);
      console.log("Data being sent:", formattedData);
      
      // Try with exact same structure as your API is expecting
      const apiUrl = `/api/editequipment?id=${formData._id}`;
      console.log("API URL:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData),
      });
      
      // Log response status for debugging
      console.log("Response status:", response.status);
      
      // Try to get response data even if it's an error
      let responseData;
      try {
        responseData = await response.json();
        console.log("Response data:", responseData);
      } catch (e) {
        console.error("Error parsing response:", e);
        responseData = { error: "Failed to parse response" };
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update equipment");
      }
      
      toast.success("Equipment updated successfully");
      
      // Update local state
      const updatedEquipment = responseData.equipment || responseData;
      onUpdate(updatedEquipment);
      onRefresh();
      
      // Switch to details tab
      setActiveTab("details");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to update equipment");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!equipment?._id) {
      toast.error("Invalid equipment ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this equipment?")) {
      return;
    }

    setIsDeleting(true);
    try {
      // Updated API path for deleting equipment
      const response = await fetch(`/api/deleteequipment`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: equipment._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete equipment");
      }
      
      toast.success("Equipment deleted successfully");
      onDelete(equipment._id);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete equipment");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!equipment) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{equipment.name}</h2>
        <Button color="default" size="sm" onClick={onClose}>
          Back to List
        </Button>
      </div>

      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={setActiveTab}
        className="mb-4"
      >
        <Tab key="details" title="Details" />
        {/* <Tab key="edit" title="Edit" /> */}
        <Tab key="bookings" title="Booking History" />
      </Tabs>

      {activeTab === "details" && (
        <div className="space-y-4">
          <div className="relative w-full h-48 mb-4">
            <Image 
              src={equipment.image || "/no-image.png"} 
              alt={equipment.name}
              fill
              className="object-contain rounded-lg" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(equipment).map(([key, value]) => (
              key !== "image" && key !== "__v" && (
                <div key={key} className="border-b pb-2">
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p>{value || "Not specified"}</p>
                </div>
              )
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button color="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete Equipment
            </Button>
            <Button color="primary" onClick={() => setActiveTab("edit")}>
              Edit Details
            </Button>
          </div>
        </div>
      )}

      {activeTab === "edit" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => {
              // Skip these fields
              if (["_id", "image", "__v", "isBooked", "__proto__"].includes(key)) return null;
              
              // Use textarea for description
              if (key === "description") {
                return (
                  <div key={key} className="col-span-1 md:col-span-2">
                    <Textarea
                      label="Description *"
                      name={key}
                      value={value || ""}
                      onChange={handleInputChange}
                      className="w-full"
                      isRequired
                      isInvalid={!!errors[key]}
                      errorMessage={errors[key]}
                    />
                  </div>
                );
              }
              
              // Condition field should be a select/dropdown with valid options
              if (key === "condition") {
                return (
                  <div key={key} className="w-full">
                    <label className="block text-sm font-medium mb-1">Condition *</label>
                    <select 
                      name={key}
                      value={value || ""}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors[key] ? 'border-red-500' : ''}`}
                      required
                    >
                      <option value="">Select Condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="damaged">Damaged</option>
                    </select>
                    {errors[key] && (
                      <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                    )}
                  </div>
                );
              }
              
              // Date fields
              if (key === "availabilityStart" || key === "availabilityEnd") {
                return (
                  <Input
                    key={key}
                    label={key === "availabilityStart" ? "Availability Start *" : "Availability End *"}
                    name={key}
                    type="date"
                    value={value ? new Date(value).toISOString().split('T')[0] : ""}
                    onChange={handleInputChange}
                    className="w-full"
                    isRequired
                    isInvalid={!!errors[key]}
                    errorMessage={errors[key]}
                  />
                );
              }
              
              // Rental price
              if (key === "rentalPrice") {
                return (
                  <Input
                    key={key}
                    label="Rental Price (₹/day) *"
                    name={key}
                    type="number"
                    value={value || ""}
                    onChange={handleInputChange}
                    className="w-full"
                    startContent={<div className="pointer-events-none">₹</div>}
                    isRequired
                    isInvalid={!!errors[key]}
                    errorMessage={errors[key]}
                  />
                );
              }
              
              // Regular fields
              const isRequired = ["name", "ownerName", "contactNumber", "address", "userId"].includes(key);
              
              return (
                <Input
                  key={key}
                  label={`${key.replace(/([A-Z])/g, " $1").replace(/^\w/, c => c.toUpperCase())} ${isRequired ? "*" : ""}`}
                  name={key}
                  value={value || ""}
                  onChange={handleInputChange}
                  className="w-full"
                  isRequired={isRequired}
                  isInvalid={!!errors[key]}
                  errorMessage={errors[key]}
                />
              );
            })}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button color="danger" variant="light" onClick={() => setActiveTab("details")}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSaveChanges} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      )}

{activeTab === "bookings" && (
  <div>
    {console.log("Current bookings state:", bookings, "Length:", bookings ? bookings.length : 0)}
    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    ) : bookings && bookings.length > 0 ? (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.bookingId} className="w-full">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Booked By</p>
                  <p>{booking.userName || "Unknown User"}</p>
                  <p className="text-xs text-gray-400">{booking.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Equipment</p>
                  <p>{booking.equipmentName || "Unknown Equipment"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p>{new Date(booking.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rental Price</p>
                  <p className="font-semibold">₹{booking.price || 0}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center p-8">
      <p className="text-gray-500">No bookings found for this equipment</p>
      <p className="text-xs text-gray-400">
        Equipment ID: {equipment ? equipment.equipmentId : "Not selected"}
      </p>
    </div>
    )}
  </div>
)}
  </div>

  );
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) fetchEquipment();
  }, [status, session]);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/userequipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.user.id }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch equipment");
      }
      
      const data = await response.json();
      setEquipment(data.equipment || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch equipment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEquipment = (equipmentId) => {
    setEquipment(prev => prev.filter(item => item._id !== equipmentId));
  };

  const handleUpdateEquipment = (updatedEquipment) => {
    setEquipment(prev => 
      prev.map(item => 
        item._id === updatedEquipment._id ? updatedEquipment : item
      )
    );
    setSelectedEquipment(updatedEquipment);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Equipment</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : equipment.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't added any equipment yet</p>
          <Button color="primary">Add New Equipment</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment List - 2/3 width on large screens if equipment is selected */}
          <div className={selectedEquipment ? "col-span-1" : "col-span-1 lg:col-span-3"}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {equipment.map((item) => (
                <EquipmentCard 
                  key={item._id} 
                  equipment={item} 
                  onSelect={setSelectedEquipment}
                  isActive={selectedEquipment?._id === item._id}
                />
              ))}
            </div>
          </div>
          
          {/* Equipment Details Panel - 2/3 width on large screens */}
          {selectedEquipment && (
            <div className="col-span-1 lg:col-span-2">
              <EquipmentDetailPanel 
                equipment={selectedEquipment}
                onClose={() => setSelectedEquipment(null)}
                onDelete={handleDeleteEquipment}
                onUpdate={handleUpdateEquipment}
                onRefresh={fetchEquipment}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}