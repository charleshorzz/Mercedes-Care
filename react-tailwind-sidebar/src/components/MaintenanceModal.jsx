import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const MaintenanceModal = ({ isOpen, setIsOpen }) => {
  const maintenanceItems = [
    "Synthetic Motor Oil and Filter Replacement",
    "Cabin Dust/ Combination Filter Replacement",
    "Break Fluid Change",
    "Fluid Level Check and Correction",
    "Multipoint Inspection ",
    "Wiper Blade Sets",
    "Rear Axle Oil Change",
    "Inspect Belts",
    "Inspect Hoses For Cracks",
    "Inspect Battery and Cables",
    "Check Tyre Pressure and Condition",
    "Check Interior and Exterior Light",
    "Coolant Service",
  ];

  const [selectedItems, setSelectedItems] = useState(
    new Array(maintenanceItems.length).fill(false)
  );

  const handleCheckboxChange = (index) => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = !updatedSelectedItems[index];
    setSelectedItems(updatedSelectedItems);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Selected items:", selectedItems);
    setIsOpen(false);
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
            className="bg-white text-black p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-center mb-4">
                Inspection Overview
              </h3>
              <div className="text-center text-gray-500 mb-6">
                Assigned to: Steve Kerr
              </div>
              <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-[400px] overflow-y-auto">
                <ul>
                  {maintenanceItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      <span className="text-gray-700">{item}</span>
                      <input
                        type="checkbox"
                        checked={selectedItems[index]}
                        onChange={() => handleCheckboxChange(index)}
                        className="form-checkbox h-5 w-5 text-black"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleSave}
                  className="bg-[#00A19B] hover:bg-[#007D76] transition-colors text-white font-semibold py-2 px-6 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MaintenanceModal;
