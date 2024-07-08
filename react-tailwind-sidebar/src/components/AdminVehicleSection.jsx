import React, { useState } from "react";
import {
  useGetVehiclesQuery,
  useGetVehicleByVinAdminQuery,
  useAddVehicleAdminMutation,
  useDeleteVehicleAdminMutation,
} from "../slices/vehicleApiSlice";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminVehicleSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vehicles, isLoading, isError, refetch } = useGetVehiclesQuery();
  const { data: searchResult, refetch: searchVehicleByVin } =
    useGetVehicleByVinAdminQuery(searchQuery, { skip: !searchQuery });
  const [addVehicleAdmin] = useAddVehicleAdminMutation();
  const [deleteVehicleAdmin] = useDeleteVehicleAdminMutation();
  const [newVehicle, setNewVehicle] = useState({
    vin: "",
    name: "",
    carPlate: "",
    nextServiceDate: "",
    nextServiceRange: "",
    premium: false,
  });
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    searchVehicleByVin();
  };

  const handleAddVehicle = async () => {
    const formData = new FormData();
    formData.append("vin", newVehicle.vin);
    formData.append("name", newVehicle.name);
    formData.append("carPlate", newVehicle.carPlate);
    formData.append("nextServiceDate", newVehicle.nextServiceDate);
    formData.append("nextServiceRange", newVehicle.nextServiceRange);
    formData.append("premium", newVehicle.premium);
    if (image) {
      formData.append("image", image);
    }

    try {
      await addVehicleAdmin(formData).unwrap();
      toast.success("Vehicle added successfully");
      refetch();
      setNewVehicle({
        vin: "",
        name: "",
        carPlate: "",
        nextServiceDate: "",
        nextServiceRange: "",
        premium: false,
      });
      setImage(null);
      setIsOpen(false); // Close the modal after adding the vehicle
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleDeleteVehicle = async (vin) => {
    try {
      await deleteVehicleAdmin(vin).unwrap();
      toast.success("Vehicle deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const confirmDelete = (vin) => {
    confirmAlert({
      message: "Are you sure you want to delete this vehicle?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteVehicle(vin),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vehicle by VIN"
          className="border p-2 rounded-l-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Search
        </button>
        <button
          onClick={openModal}
          className="ml-auto bg-[#00A19B] text-white p-2 rounded-lg w-24 hover:bg-[#006e4f]"
        >
          Add
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading vehicles</p>
      ) : searchResult ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-center">Name</th>
              <th className="py-2 text-center">Car Plate</th>
              <th className="py-2 text-center">VIN</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr key={searchResult.vin}>
              <td className="border px-4 py-2 text-center">
                {searchResult.name}
              </td>
              <td className="border px-4 py-2 text-center">
                {searchResult.carPlate}
              </td>
              <td className="border px-4 py-2 text-center">
                {searchResult.vin}
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => confirmDelete(searchResult.vin)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-center">Name</th>
              <th className="py-2 text-center">Car Plate</th>
              <th className="py-2 text-center">VIN</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles?.map((vehicle) => (
              <tr key={vehicle.vin}>
                <td className="border px-4 py-2 text-center">{vehicle.name}</td>
                <td className="border px-4 py-2 text-center">
                  {vehicle.carPlate}
                </td>
                <td className="border px-4 py-2 text-center">{vehicle.vin}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => confirmDelete(vehicle.vin)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-center mb-2">
                  Add Vehicle
                </h3>
                <input
                  type="text"
                  className="mb-2 mt-4 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newVehicle.vin}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, vin: e.target.value })
                  }
                  placeholder="VIN"
                />
                <input
                  type="text"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newVehicle.name}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <input
                  type="text"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newVehicle.carPlate}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, carPlate: e.target.value })
                  }
                  placeholder="Car Plate"
                />
                <input
                  type="date"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newVehicle.nextServiceDate}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      nextServiceDate: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newVehicle.nextServiceRange}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      nextServiceRange: e.target.value,
                    })
                  }
                  placeholder="Next Service Range"
                />
                <input
                  type="file"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={newVehicle.premium}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        premium: e.target.checked,
                      })
                    }
                  />
                  Premium
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-transparent hover:bg-gray-200 transition-colors text-black font-semibold w-full py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVehicle}
                    className="bg-[#00A19B] hover:bg-emerald-700 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVehicleSection;
