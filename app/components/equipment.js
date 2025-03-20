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
