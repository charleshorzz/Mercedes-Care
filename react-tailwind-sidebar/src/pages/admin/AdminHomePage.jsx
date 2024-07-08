import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import DatePicker from "tailwind-datepicker-react";
import AppointmentKanban from "../../components/AppointmentKanban";
import AddAppointmentModal from "../../components/AddAppointmentModal";

const AdminHomePage = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDatePickerClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    // Set the time to midnight to avoid timezone issues
    const adjustedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setSelectedDate(adjustedDate);
    setShowDatePicker(false);
  };

  const handleShowDatePicker = (show) => {
    setShowDatePicker(show);
  };

  return (
    <div className="p-8 font-alata">
      <div className="flex items-center justify-between p-4">
        <div
          className="relative text-white bg-[#00A19B] shadow-md bg-clip-border rounded-xl w-[18rem] cursor-pointer"
          onClick={handleDatePickerClick}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col w-full text-lg">
                <label>Today's Appointments</label>
              </div>
              <MdKeyboardArrowDown
                size={30}
                className={`transform transition-transform duration-300 ${
                  showDatePicker ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          {showDatePicker && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-400 rounded-md shadow-lg left-0">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                show={showDatePicker}
                setShow={handleShowDatePicker}
                minDate={new Date()} // Set the minimum selectable date to today
                className="bg-gray-100 w-full rounded p-2"
              />
            </div>
          )}
        </div>
        <button
          className="mt-6 w-48 py-3 bg-[#00A19B] text-white rounded-lg hover:bg-[#007D76] transition duration-200 text-md"
          onClick={() => setIsModalOpen(true)}
        >
          New Appointment
        </button>
      </div>
      <div className="w-full h-[34rem] overflow-auto scrollbar-hide scroll-smooth">
        <AppointmentKanban
          selectedDate={selectedDate.toISOString().split("T")[0]}
        />
      </div>
      <AddAppointmentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default AdminHomePage;
