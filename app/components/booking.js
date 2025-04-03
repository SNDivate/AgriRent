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
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (status === "authenticated") {
      fetchAvailableEquipment();
    }
  }, [status]);

  const fetchAvailableEquipment = async () => {
    try {
      setIsLoading(true);
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

  const resetForm = () => {
    setRentalStartDate("");
    setRentalEndDate("");
    setPaymentAmount("");
    setSelectedEquipment(null);
  };

  const calculateRentalDays = () => {
    if (!rentalStartDate || !rentalEndDate) return 0;
    
    const startDate = new Date(rentalStartDate);
    const endDate = new Date(rentalEndDate);
    
    // Calculate the difference in milliseconds
    const diffTime = Math.abs(endDate - startDate);
    // Convert to days and add 1 (inclusive of start and end date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
  };

  // Calculate the total payment automatically when dates change
  useEffect(() => {
    if (selectedEquipment && rentalStartDate && rentalEndDate) {
      const days = calculateRentalDays();
      const totalAmount = (selectedEquipment.rentalPrice * days).toFixed(2);
      setPaymentAmount(totalAmount);
    }
  }, [selectedEquipment, rentalStartDate, rentalEndDate]);

  const handleBooking = async () => {
    if (!selectedEquipment || !rentalStartDate || !rentalEndDate || !paymentAmount) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate payment amount
    if (isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount");
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
      setIsSubmitting(true);
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: selectedEquipment._id,
          userId: session.user.id,
          rentalStartDate: rentalStartDate,
          rentalEndDate: rentalEndDate,
          paymentAmount: parseFloat(paymentAmount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create booking");
      }

      toast.success("Booking created successfully");
      resetForm();
      onClose();
      fetchAvailableEquipment();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Equipment</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" label="Loading equipment..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableEquipment.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-500">No equipment available for booking at the moment.</p>
            </div>
          ) : (
            availableEquipment.map((equipment) => (
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
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">{equipment.name}</p>
                    <Chip size="sm" variant="flat">
                      {equipment.condition || "Not specified"}
                    </Chip>
                    <p className="text-sm mt-1 text-default-600">
                      ${equipment.rentalPrice}/day
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-sm text-default-600">{equipment.description || "No description available"}</p>
                  <p className="text-sm text-default-600 mt-2">
                    <strong>Available:</strong> {new Date(equipment.availabilityStart).toLocaleDateString()} to {new Date(equipment.availabilityEnd).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-default-600 mt-1">
                    <strong>Owner:</strong> {equipment.ownerName}
                  </p>
                </CardBody>
                <Divider />
                <Button 
                  color="primary" 
                  className="m-2"
                  onClick={() => { 
                    setSelectedEquipment(equipment); 
                    onOpen(); 
                  }}
                >
                  View Details
                </Button>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
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
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat" color="primary">
                    ${selectedEquipment.rentalPrice}/day
                  </Chip>
                  <Chip size="sm" variant="flat">
                    {selectedEquipment.condition}
                  </Chip>
                </div>
                <p>{selectedEquipment.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <strong>Available from:</strong>{" "}
                    {new Date(selectedEquipment.availabilityStart).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Available until:</strong>{" "}
                    {new Date(selectedEquipment.availabilityEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p>
                    <strong>Owner:</strong> {selectedEquipment.ownerName}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedEquipment.contactNumber}
                  </p>
                </div>
                <p>
                  <strong>Address:</strong> {selectedEquipment.address}
                </p>
                
                <Divider className="my-2" />
                <h3 className="text-lg font-semibold">Book This Equipment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Start Date"
                    value={rentalStartDate}
                    onChange={(e) => setRentalStartDate(e.target.value)}
                    min={new Date(selectedEquipment.availabilityStart).toISOString().split('T')[0]}
                    max={new Date(selectedEquipment.availabilityEnd).toISOString().split('T')[0]}
                    isRequired
                  />
                  <Input
                    type="date"
                    label="End Date"
                    value={rentalEndDate}
                    onChange={(e) => setRentalEndDate(e.target.value)}
                    min={rentalStartDate || new Date(selectedEquipment.availabilityStart).toISOString().split('T')[0]}
                    max={new Date(selectedEquipment.availabilityEnd).toISOString().split('T')[0]}
                    isDisabled={!rentalStartDate}
                    isRequired
                  />
                </div>
                
                {/* Payment Amount Field - Now read-only since it's calculated automatically */}
                <Input
                  type="number"
                  label="Total Payment Amount"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  value={paymentAmount}
                  isReadOnly
                  description="This amount is automatically calculated based on rental period"
                />
                
                {/* Payment Summary Box */}
                {paymentAmount && rentalStartDate && rentalEndDate && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-md font-semibold mb-2">Payment Summary</h3>
                    <div className="flex justify-between">
                      <span>Daily Rental Rate:</span>
                      <span>${selectedEquipment.rentalPrice.toFixed(2)}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rental Duration:</span>
                      <span>{calculateRentalDays()} days</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total Payment:</span>
                      <span>${parseFloat(paymentAmount).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This amount will be charged for your rental period.
                    </p>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onClick={handleBooking}
              isLoading={isSubmitting}
              isDisabled={!selectedEquipment || !rentalStartDate || !rentalEndDate || !paymentAmount || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Book Now"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}