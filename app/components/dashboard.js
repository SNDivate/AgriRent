"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Chip,
  Divider,
  Input,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { toast } from "sonner";

// **EquipmentCard Component**
function EquipmentCard({ equipment, onEdit, onDelete, onView, onViewBookings }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="relative w-24 h-24">
          {equipment.image ? (
            <Image
              alt={equipment?.name || "Equipment"}
              src={equipment.image || "/no-image.png"}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 768px"
              priority={false}
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
        <p className="text-sm text-default-600">{equipment.description || "No description available"}</p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">₹{equipment.rentalPrice || 0}/day</p>
        <div className="flex gap-2">
          <Button color="secondary" size="sm" onPress={() => onView(equipment)}>View</Button>
          <Button color="primary" size="sm" onPress={() => onEdit(equipment)}>Edit</Button>
          <Button color="danger" size="sm" onPress={() => onDelete(equipment._id)}>Delete</Button>
          <Button color="warning" size="sm" onPress={() => onViewBookings(equipment._id)}>Bookings</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// **Equipment Modal Component**
function EquipmentModal({ isOpen, onClose, equipment, viewMode, onUpdate }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || "",
        description: equipment.description || "",
        rentalPrice: equipment.rentalPrice || "",
        condition: equipment.condition || "",
        ownerName: equipment.ownerName || "",
        contactNumber: equipment.contactNumber || "",
        address: equipment.address || "",
        availabilityStart: equipment.availabilityStart ? new Date(equipment.availabilityStart).toISOString().split("T")[0] : "",
        availabilityEnd: equipment.availabilityEnd ? new Date(equipment.availabilityEnd).toISOString().split("T")[0] : "",
      });
    }
  }, [equipment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (onUpdate) {
      await onUpdate(formData);
    } else {
      toast.error("Update function is missing!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>{viewMode ? "Equipment Details" : "Edit Equipment"}</ModalHeader>
        <ModalBody>
          {viewMode ? (
            <div className="space-y-2">
              {Object.entries(formData).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value || "Not specified"}
                </p>
              ))}
            </div>
          ) : (
            <>
              {Object.keys(formData).map((key) => (
                <Input key={key} label={key.replace(/([A-Z])/g, " $1")} name={key} value={formData[key]} onChange={handleInputChange} />
              ))}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>Close</Button>
          {!viewMode && <Button color="primary" onPress={handleSubmit}>Save Changes</Button>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// **Main Dashboard Component**
export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) fetchEquipment();
  }, [status, session]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch("/api/userequipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.user.id }),
      });

      if (!response.ok) throw new Error("Failed to fetch equipment");

      const data = await response.json();
      setEquipment(data.equipment || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      if (!selectedEquipment?._id) {
        throw new Error("Equipment ID is missing");
      }
  
      const response = await fetch(`/api/editequipment/${selectedEquipment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update equipment");
      }
  
      toast.success("Equipment updated successfully");
      fetchEquipment();
      setIsEquipmentModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update equipment");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <EquipmentCard 
            key={item._id || item.id}  
            equipment={item} 
            onEdit={() => { setSelectedEquipment(item); setViewMode(false); setIsEquipmentModalOpen(true); }} 
            onView={() => { setSelectedEquipment(item); setViewMode(true); setIsEquipmentModalOpen(true); }} 
          />
        ))}
      </div>

      <EquipmentModal 
        isOpen={isEquipmentModalOpen} 
        onClose={() => setIsEquipmentModalOpen(false)} 
        equipment={selectedEquipment} 
        viewMode={viewMode} 
        onUpdate={handleUpdate} 
      />
    </div>
  );
}
