import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import { SiMercedes } from "react-icons/si";
import { toast } from "react-toastify";
import { useAddVehicleMutation } from "../slices/vehicleApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const ModalBox = ({ isOpen, setIsOpen }) => {
  const [vin, setVin] = useState("");
  const [addVehicle] = useAddVehicleMutation();
  const dispatch = useDispatch();

  const handleaddBtn = async () => {
    try {
      const response = await addVehicle({ vin }).unwrap();
      const updatedUser = response.user;
      // Optionally, trigger a refetch or update local state to show the new vehicle in the UI
      dispatch(setCredentials({ ...updatedUser }));
      setIsOpen(false); // Close the modal after adding the vehicle
      toast.success("Vehicle has been added");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <SiMercedes className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <SiMercedes />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Add Your Vehicle
              </h3>
              <input
                type="text"
                className="mb-8 mt-4 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-[21rem] no-spinner leading-7"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="Enter your 17 digit VIN here"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Go Back
                </button>
                <button
                  onClick={handleaddBtn}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalBox;
