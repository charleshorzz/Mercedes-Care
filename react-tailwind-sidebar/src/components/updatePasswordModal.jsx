import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SiMercedes } from "react-icons/si";

const updatePasswordModal = ({ isOpen, setIsOpen }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveBtn = () => {
    // Add logic for saving the new password here
    setIsOpen(false);
    alert("Your password has been updated");
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black p-6 rounded-lg w-full max-w-sm shadow-xl cursor-default relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 mb-4 rounded-full text-3xl text-black grid place-items-center mx-auto">
                <SiMercedes />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Update Password</h3>
                <div className="mb-4">
                  <input
                    type="password"
                    className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Old Password"
                  />
                  <input
                    type="password"
                    className="mb-2 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                  />
                  <input
                    type="password"
                    className="text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 transition-colors text-black font-semibold w-full py-2 rounded"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleSaveBtn}
                    className="bg-teal-500 hover:bg-teal-600 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default updatePasswordModal;
