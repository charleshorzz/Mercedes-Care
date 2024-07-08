import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMakeAppointmentMutation } from "../slices/appointmentSlice";
import DatePicker from "tailwind-datepicker-react";
import { SiMercedes } from "react-icons/si";

const AddAppointmentModal = ({ isOpen, setIsOpen }) => {
  const [vin, setVin] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("Major Service");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [makeAppointment] = useMakeAppointmentMutation();

  const handleDateChange = (date) => {
    // Set the time to midnight to avoid timezone issues
    const adjustedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setSelectedDate(adjustedDate);
    setShowDatePicker(false);
  };

  const handleAddAppointment = async () => {
    if (!vin || !selectedDate || !selectedTime) {
      toast.error("Please fill out all fields");
      return;
    }

    const appointmentData = {
      vin,
      type: selectedPackage,
      vehicle: selectedVehicle,
      date: selectedDate,
      time: selectedTime,
      location: "BR Jaya SDN BHD",
    };

    try {
      await makeAppointment(appointmentData).unwrap();
      toast.success("Appointment Created");
      setIsOpen(false);
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
            className="bg-white text-black p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <SiMercedes className="text-black/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-black grid place-items-center mx-auto">
                <SiMercedes />
              </div>
              <h3 className="text-3xl font-bold text-center mb-4">
                New Appointment
              </h3>
              <input
                type="text"
                className="mb-4 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="Enter VIN"
              />
              <select
                className="mb-4 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                <option value="Major Service">Major Service</option>
                <option value="Regular Service">Regular Service</option>
                <option value="Checking">Checking</option>
              </select>
              <div className="mb-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  show={showDatePicker}
                  setShow={setShowDatePicker}
                  minDate={new Date()}
                  className="w-full rounded"
                />
              </div>
              <input
                type="time"
                className="mb-4 text-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-gray-500 text-black w-full"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-gray-200 transition-colors text-black font-semibold w-full py-2 rounded"
                >
                  Go Back
                </button>
                <button
                  onClick={handleAddAppointment}
                  className="bg-[#00A19B] hover:bg-emerald-700 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAppointmentModal;
