import React, { useState } from "react";
import {
  useGetMechanicsQuery,
  useAddMechanicMutation,
} from "../slices/usersApiSlice";
import { useGetAssignedAppointmentsQuery } from "../slices/appointmentSlice";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { SiMercedes } from "react-icons/si";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const MechanicSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: mechanics,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMechanicsQuery();
  const [addMechanic] = useAddMechanicMutation();
  const [newMechanic, setNewMechanic] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data: assignedAppointments } = useGetAssignedAppointmentsQuery(
    selectedMechanic?._id,
    {
      skip: !selectedMechanic,
    }
  );

  const handleSearch = () => {
    refetch();
  };

  const handleAddMechanic = async () => {
    try {
      await addMechanic(newMechanic).unwrap();
      toast.success("Mechanic added successfully");
      refetch();
      setNewMechanic({ name: "", email: "", password: "", phone: "" });
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedMechanic(null);
  };

  const handleMechanicClick = (mechanic) => {
    setSelectedMechanic(mechanic);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedMechanic._id).unwrap();
      toast.success("Mechanic removed");
      refetch();
      closeModal();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      message: "Are you sure you want to delete this mechanic?",
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
    <div className="relative">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search mechanic"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>
            Error loading mechanics: {error?.data?.message || error?.message}
          </p>
        ) : (
          mechanics?.map((mechanic) => (
            <div
              key={mechanic._id}
              className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => handleMechanicClick(mechanic)}
            >
              <h2 className="text-xl font-bold mb-2">{mechanic.name}</h2>
              <p>{mechanic.email}</p>
            </div>
          ))
        )}
      </div>

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
              <SiMercedes className="text-black/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
              <div className="relative z-10">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-black grid place-items-center mx-auto">
                  <SiMercedes />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  Add Mechanic
                </h3>
                <input
                  type="text"
                  className="mb-2 mt-4 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newMechanic.name}
                  onChange={(e) =>
                    setNewMechanic({ ...newMechanic, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <input
                  type="email"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newMechanic.email}
                  onChange={(e) =>
                    setNewMechanic({ ...newMechanic, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <input
                  type="password"
                  className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newMechanic.password}
                  onChange={(e) =>
                    setNewMechanic({ ...newMechanic, password: e.target.value })
                  }
                  placeholder="Password"
                />
                <input
                  type="text"
                  className="mb-8 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                  value={newMechanic.phone}
                  onChange={(e) =>
                    setNewMechanic({ ...newMechanic, phone: e.target.value })
                  }
                  placeholder="Phone （+60）"
                />
                <div className="flex gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-transparent hover:bg-gray-200 transition-colors text-black font-semibold w-full py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMechanic}
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

      <AnimatePresence>
        {selectedMechanic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
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
                <h2 className="text-2xl font-bold my-6">
                  {selectedMechanic.name}
                </h2>
                <div className="flex gap-16">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-600 mb-1 text-sm">Email:</p>
                    <p className="font-semibold mb-4">
                      {selectedMechanic.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-600 mb-1 text-sm">Contact:</p>
                    <p className="font-semibold mb-8">
                      {selectedMechanic.phone}
                    </p>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Assigned Appointments:
                  </h3>
                  {assignedAppointments ? (
                    assignedAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="mb-4 border p-2 rounded"
                      >
                        <p className="text-sm">
                          VIN: {appointment.vehicle.vin}
                        </p>
                        <p className="text-sm">
                          Vehicle: {appointment.vehicle.name}
                        </p>
                        <p className="text-sm">Type: {appointment.type}</p>
                        <p className="text-sm">
                          Date:{" "}
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm">Time: {appointment.time}</p>
                      </div>
                    ))
                  ) : (
                    <p>No appointments assigned</p>
                  )}
                </div>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full"
                  onClick={confirmDelete}
                >
                  Remove
                </button>
              </div>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MechanicSection;
