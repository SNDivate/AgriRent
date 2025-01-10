"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";

export default function BookingPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [rentalDate, setRentalDate] = useState("");
  const [equipmentDetailsModal, setEquipmentDetailsModal] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
      fetchAvailableEquipment();
    }
  }, [status]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/booking?userId=${session.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    }
  };

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
    if (!selectedEquipment || !rentalDate) {
      toast.error("Please select equipment and rental date");
      return;
    }

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: selectedEquipment._id,
          userId: session.user.id,
          rentalDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to create booking");
      toast.success("Booking created successfully");
      onClose();
      fetchBookings();
      fetchAvailableEquipment();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    }
  };

  const handleEquipmentClick = async (equipmentId) => {
    try {
      if (!equipmentId) {
        throw new Error("Equipment ID is required");
      }
  
      const response = await fetch(`/api/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ equipmentId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch equipment details");
      }
  
      const data = await response.json();
  
      if (!data || !data.equipment) {
        throw new Error("No equipment data found");
      }
  
      // Set the fetched equipment data from the response
      setSelectedEquipment(data.equipment);
      setEquipmentDetailsModal(true);
    } catch (error) {
      console.error("Error fetching equipment details:", error);
      toast.error("Failed to fetch equipment details");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-danger text-lg">Please sign in to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>

      <Card className="mb-6">
        <CardBody>
          <Button color="primary" onPress={onOpen}>
            Create New Booking
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Table aria-label="Booking history table">
            <TableHeader>
              <TableColumn>Equipment</TableColumn>
              <TableColumn>Rental Date</TableColumn>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <button
                      className="text-primary underline"
                      onClick={() => handleEquipmentClick(booking.equipmentId._id)}
                    >
                      {booking.equipmentId.name}
                    </button>
                  </TableCell>
                  <TableCell>
                    {new Date(booking.rentalDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Create New Booking</ModalHeader>
          <ModalBody>
            <select
              className="w-full p-2 mb-4 border rounded"
              onChange={(e) =>
                setSelectedEquipment(
                  availableEquipment.find((eq) => eq._id === e.target.value)
                )
              }
            >
              <option value="">Select Equipment</option>
              {availableEquipment.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleBooking}>
              Book Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={equipmentDetailsModal}
        onClose={() => setEquipmentDetailsModal(false)}
      >
        <ModalContent>
          <ModalHeader>Equipment Details</ModalHeader>
          <ModalBody>
            {selectedEquipment ? (
              <div>
                {selectedEquipment.image && (
                  <div className="relative w-full h-64 mb-4">
                    <img
                      src={selectedEquipment.image.includes('res.cloudinary.com') 
                        ? selectedEquipment.image
                        : `https://res.cloudinary.com/dizarh1il/image/upload/${selectedEquipment.image}`}
                      alt={selectedEquipment.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        console.error('Image load failed:', e.target.src);
                        e.target.src = '/no-image.png';
                        toast.error('Failed to load equipment image');
                      }}
                      loading="lazy"
                    />
                  </div>
                )}
                
                <h2 className="text-lg font-bold mb-2">{selectedEquipment.name}</h2>
                
                <p className="text-sm mb-4">
                  {selectedEquipment.description || "Description is not available."}
                </p>
                
                <div className="space-y-2">
                  {selectedEquipment.rentalPrice && (
                    <p>
                      <span className="font-semibold">Price:</span> ₹
                      {selectedEquipment.rentalPrice}
                    </p>
                  )}
                  {selectedEquipment.condition && (
                    <p>
                      <span className="font-semibold">Condition:</span>{" "}
                      {selectedEquipment.condition}
                    </p>
                  )}
                  {selectedEquipment.ownerName && (
                    <p>
                      <span className="font-semibold">Owner:</span>{" "}
                      {selectedEquipment.ownerName}
                    </p>
                  )}
                  {selectedEquipment.address && (
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {selectedEquipment.address}
                    </p>
                  )}
                  {selectedEquipment.contactNumber && (
                    <p>
                      <span className="font-semibold">Contact:</span>{" "}
                      {selectedEquipment.contactNumber}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-danger">Equipment details are unavailable.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => setEquipmentDetailsModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}