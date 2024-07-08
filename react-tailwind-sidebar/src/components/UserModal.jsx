import React, { useEffect, useState } from "react";
import { useGetVehiclesByVINsMutation } from "../slices/vehicleApiSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../slices/usersApiSlice"; // Import the necessary hooks
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS for react-confirm-alert

const UserModal = ({ user, onClose }) => {
  const [getVehiclesByVINs] = useGetVehiclesByVINsMutation();
  const [deleteUser] = useDeleteUserMutation(); // Use the mutation
  const { refetch } = useGetUsersQuery(); // Destructure the refetch method
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (user.vehicles && user.vehicles.length > 0) {
        const vinList = user.vehicles.map((vehicle) => vehicle.vin);
        setIsLoading(true);
        setIsError(false);
        try {
          const response = await getVehiclesByVINs({ vins: vinList }).unwrap();
          setVehicleDetails(response);
        } catch (error) {
          setIsError(true);
          console.error("Error fetching vehicle details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchVehicleDetails();
  }, [user, getVehiclesByVINs]);

  const handleDelete = async () => {
    try {
      await deleteUser(user._id).unwrap();
      toast.success("User removed");
      refetch(); // Refetch users after deletion
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          onClick: handleDelete,
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="bg-gray-900/50 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold my-6">{user.name}</h2>
              <div className="flex gap-16">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 mb-1 text-sm">Email:</p>
                  <p className="font-semibold mb-4">{user.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 mb-1 text-sm">Contact:</p>
                  <p className="font-semibold mb-8">{user.phone}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">Vehicle Owned</h3>
              {isLoading ? (
                <p>Loading vehicle details...</p>
              ) : isError ? (
                <p>Error loading vehicle details...</p>
              ) : vehicleDetails.length > 0 ? (
                <div className="bg-gray-100 p-6 rounded-md w-full h-[14rem] overflow-auto scrollbar-hide scroll-smooth">
                  {vehicleDetails.map((vehicle) => (
                    <div key={vehicle.vin} className="mb-4">
                      <div className="flex gap-24">
                        <p className="font-bold text-xl">{vehicle.name}</p>
                        <p>{vehicle.carPlate}</p>
                      </div>
                      <p className="text-gray-500 text-sm">{vehicle.vin}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No vehicles found.</p>
              )}
              <button
                className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full"
                onClick={confirmDelete} // Call confirmDelete on button click
              >
                Remove
              </button>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserModal;
