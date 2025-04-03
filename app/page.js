'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Divider
} from '@nextui-org/react'
import { ArrowRight, Calendar, Clock, User, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'

import { NavbarDemo } from './components/navbar'
import { ImagesSliderDemo } from './components/carousel'
import Footer from './components/footer'

export default function Home() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/allequipment');
      if (!response.ok) throw new Error('Failed to fetch equipment');
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment);
    onOpen();
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div>
      <NavbarDemo />
      <ImagesSliderDemo />

      {/* Equipment Showcase Section */}
      <section className="py-10 px-5 bg-gray-100">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Agricultural Equipment
        </motion.h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {equipment.slice(0, 4).map((item) => (
              <motion.div key={item._id} variants={itemVariants}>
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="p-0 relative">
                    <div className="w-full h-48 relative overflow-hidden">
                      <img
                        src={item.image?.image_url || "/no-image.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/no-image.png";
                        }}
                      />
                      <div 
                        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                          item.isBooked ? "bg-yellow-400" : "bg-green-500"
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <Chip size="sm" color={item.isBooked ? "warning" : "success"}>
                        {item.isBooked ? "Booked" : "Available"}
                      </Chip>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      {item.description?.substring(0, 100)}{item.description?.length > 100 ? '...' : ''}
                    </p>
                    <Button 
                      color="primary" 
                      className="w-full"
                      onClick={() => handleEquipmentClick(item)}
                    >
                      View Details
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/equipment">
            <Button color="primary" endContent={<ArrowRight size={16} />}>
              View All Equipment
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Equipment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedEquipment?.name}
              </ModalHeader>
              <ModalBody>
                {selectedEquipment && (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={selectedEquipment.image?.image_url || "/no-image.png"}
                        alt={selectedEquipment.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <h2 className="text-xl font-bold">{selectedEquipment.name}</h2>
                      <p>{selectedEquipment.description || "No description available"}</p>
                    </motion.div>
                    
                    <Divider />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Condition</p>
                        <p className="capitalize">{selectedEquipment.condition || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Status</p>
                        <Chip size="sm" color={selectedEquipment.isBooked ? "warning" : "success"}>
                          {selectedEquipment.isBooked ? "Currently Booked" : "Available for Booking"}
                        </Chip>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Rental Price</p>
                        <p>${selectedEquipment.rentalPrice?.toFixed(2) || "Price not available"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Owner</p>
                        <p>{selectedEquipment.ownerName || "Not specified"}</p>
                      </div>
                    </motion.div>
                    
                    <Divider />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <p className="text-sm font-semibold text-gray-600">Contact Information</p>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          <p>{selectedEquipment.contactNumber || "Not provided"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <p>{selectedEquipment.address || "Not provided"}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <Divider />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p className="text-sm font-semibold text-gray-600">Availability Period</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span>
                          {selectedEquipment.availabilityStart 
                            ? new Date(selectedEquipment.availabilityStart).toLocaleDateString() 
                            : "Start date not specified"} -
                          {selectedEquipment.availabilityEnd 
                            ? " " + new Date(selectedEquipment.availabilityEnd).toLocaleDateString() 
                            : " End date not specified"}
                        </span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <p className="text-sm font-semibold text-gray-600">Added</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={16} className="text-gray-500" />
                        <span>
                          {selectedEquipment.createdAt 
                            ? new Date(selectedEquipment.createdAt).toLocaleDateString() 
                            : "Date not available"}
                        </span>
                      </div>
                    </motion.div>

                    {/* Booking Information (only shown if equipment is booked) */}
                    {selectedEquipment.isBooked && (
                      <>
                        <Divider />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                        >
                          <h3 className="text-lg font-semibold mb-2">Booking Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-500" />
                              <p><span className="font-medium">Booked By:</span> {selectedEquipment.bookedBy?.name || "Not available"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-500" />
                              <p>
                                <span className="font-medium">Booking Period:</span> {selectedEquipment.bookingStart 
                                  ? new Date(selectedEquipment.bookingStart).toLocaleDateString() 
                                  : "Not specified"} - 
                                {selectedEquipment.bookingEnd 
                                  ? " " + new Date(selectedEquipment.bookingEnd).toLocaleDateString() 
                                  : " Not specified"}
                              </p>
                            </div>
                            {selectedEquipment.bookedBy?.contactNumber && (
                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500" />
                                <p><span className="font-medium">Contact:</span> {selectedEquipment.bookedBy.contactNumber}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Footer />
    </div>
  )
}