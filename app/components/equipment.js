'use client';

import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

export default function EquipmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    condition: '',
    rentalPrice: '',
    ownerName: '',
    contactNumber: '',
    address: '',
    image: null,
    availabilityStart: '',    // Changed from availabilityStartDate
    availabilityEnd: '',      // Changed from availabilityEndDate
  });
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = (acceptedFiles) => {
    setFormData((prev) => ({ ...prev, image: acceptedFiles[0] }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const validateFormData = () => {
    const requiredFields = [
      'name',
      'description',
      'condition',
      'rentalPrice',
      'ownerName',
      'contactNumber',
      'address',
      'availabilityStart',
      'availabilityEnd',
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!session?.user?.id) {
      toast.error('Invalid user ID');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) return;

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', session.user.id);

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('/api/newequipment', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add equipment');
      }

      toast.success('Equipment added successfully!');
      onClose();
      setFormData({
        name: '',
        description: '',
        condition: '',
        rentalPrice: '',
        ownerName: '',
        contactNumber: '',
        address: '',
        image: null,
        availabilityStart: '',
        availabilityEnd: '',
      });
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Equipment Management</h1>
      <Button color="primary" onPress={onOpen}>
        Add Equipment
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <ModalHeader className="flex flex-col gap-1">Add New Equipment</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            <Select
  label="Condition"
  name="condition"
  value={formData.condition}
  onChange={(value) => setFormData((prev) => ({ ...prev, condition: value.target.value || value }))}
  required
>
  <SelectItem key="new" value="new">New</SelectItem>
  <SelectItem key="used" value="used">Used</SelectItem>
  <SelectItem key="damaged" value="damaged">Damaged</SelectItem>
</Select>
              <Input
                label="Rental Price"
                name="rentalPrice"
                type="number"
                value={formData.rentalPrice}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Owner Name"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <div {...getRootProps()} className="border-2 border-dashed p-4 text-center">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <>
                    <p>Add Files if available</p>
                    {formData.image && (
                      <>
                        <p>{formData.image.name}</p>
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Selected"
                          className="max-w-full h-auto mt-4"
                        />
                      </>
                    )}
                  </>
                )}
              </div>
              <Input
  type="datetime-local"
  label="Availability Start"
  name="availabilityStart"  // Changed from availabilityStartDate
  value={formData.availabilityStart}
  onChange={handleInputChange}
  required
/>
<Input
  type="datetime-local"
  label="Availability End"
  name="availabilityEnd"    // Changed from availabilityEndDate
  value={formData.availabilityEnd}
  onChange={handleInputChange}
  required
/>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Add Equipment
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}