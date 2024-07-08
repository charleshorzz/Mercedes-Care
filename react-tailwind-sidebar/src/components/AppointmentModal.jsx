import { AnimatePresence, motion } from "framer-motion";
import { useDeleteAppointmentMutation } from "../slices/appointmentSlice.js";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AppointmentModal = ({ isOpen, setIsOpen, appointment }) => {
  const formatDateToMalaysia = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    };
    return new Intl.DateTimeFormat("en-MY", options).format(
      new Date(dateString)
    );
  };

  const [deleteAppointment] = useDeleteAppointmentMutation();

  const handleDelete = async () => {
    if (appointment && appointment._id) {
      try {
        await deleteAppointment(appointment._id).unwrap();
        setIsOpen(false);
        toast.success("Appoinment cancelled successfully.");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      message: "Are you sure you want to delete the appointment?",
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
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-bold mb-4">Appointment</h3>
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                {appointment ? (
                  <>
                    <div className="mb-2">
                      <span className="font-semibold">Date:</span>{" "}
                      {formatDateToMalaysia(appointment.date)}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Time:</span>{" "}
                      {appointment.time}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Vehicle VIN:</span>{" "}
                      {appointment.vin}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Service Package:</span>{" "}
                      {appointment.type}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Service Center:</span>{" "}
                      {appointment.location}
                    </div>
                  </>
                ) : (
                  <div>No appointment found</div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 transition-colors text-black font-semibold w-full py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentModal;
