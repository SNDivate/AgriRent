"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Chip,
  Input,
  Divider,
} from "@nextui-org/react";
import { toast } from "sonner";

export default function BookingPage() {
  const { data: session, status } = useSession();
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [rentalStartDate, setRentalStartDate] = useState("");
  const [rentalEndDate, setRentalEndDate] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (status === "authenticated") {
      fetchAvailableEquipment();
    }
  }, [status]);

  const fetchAvailableEquipment = async () => {
    try {
      const response = await fetch("/api/notbooked");
      if (!response.ok) throw new Error("Failed to fetch available equipment");
      const data = await response.json();
      setAvailableEquipment(data);
    } catch (error) {
      console.error("Error fetching available equipment:", error);
      toast.error("Failed to fetch available equipment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedEquipment || !rentalStartDate || !rentalEndDate) {
      toast.error("Please select rental start and end date");
      return;
    }

    // Convert dates to Date objects
    const startDate = new Date(rentalStartDate);
    const endDate = new Date(rentalEndDate);
    const availabilityStart = new Date(selectedEquipment.availabilityStart);
    const availabilityEnd = new Date(selectedEquipment.availabilityEnd);

    // Validate date range
    if (startDate < availabilityStart || endDate > availabilityEnd || startDate > endDate) {
      toast.error("Selected dates are outside the equipment's availability range or invalid");
      return;
    }

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: selectedEquipment._id,
          userId: session.user.id,
          rentalStartDate: rentalStartDate,
          rentalEndDate: rentalEndDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create booking");
      }

      toast.success("Booking created successfully");
      onClose();
      fetchAvailableEquipment();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Equipment</h1>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableEquipment.map((equipment) => (
            <Card key={equipment._id} className="w-full">
              <CardHeader className="flex gap-3">
                <div className="relative w-24 h-24">
                  <img
                    src={equipment.image?.image_url || "/no-image.png"}
                    alt={equipment.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/no-image.png";
                      toast.error("Failed to load equipment image");
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{equipment.name}</p>
                  <Chip size="sm" variant="flat">
                    {equipment.condition || "Not specified"}
                  </Chip>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-sm text-default-600">{equipment.description || "No description available"}</p>
              </CardBody>
              <Divider />
              <Button color="primary" onClick={() => { setSelectedEquipment(equipment); onOpen(); }}>
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Equipment Details</ModalHeader>
          <ModalBody>
            {selectedEquipment && (
              <div className="space-y-4">
                <img
                  src={selectedEquipment.image?.image_url || "/no-image.png"}
                  alt={selectedEquipment.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h2 className="text-xl font-bold">{selectedEquipment.name}</h2>
                <p>{selectedEquipment.description}</p>
                <p>
                  <strong>Available from:</strong>{" "}
                  {new Date(selectedEquipment.availabilityStart).toLocaleDateString()}
                </p>
                <p>
                  <strong>Available until:</strong>{" "}
                  {new Date(selectedEquipment.availabilityEnd).toLocaleDateString()}
                </p>
                <Input
                  type="date"
                  label="Start Date"
                  value={rentalStartDate}
                  onChange={(e) => setRentalStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={rentalEndDate}
                  onChange={(e) => setRentalEndDate(e.target.value)}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={onClose}>
              Close
            </Button>
            <Button color="primary" onClick={handleBooking}>
              Book Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
