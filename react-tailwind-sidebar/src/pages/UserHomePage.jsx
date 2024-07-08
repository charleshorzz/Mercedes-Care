import React, { useState, useEffect } from "react";
import Model from "../components/3d-Components/Model.jsx";
import { useSelector } from "react-redux";
import { MdKeyboardArrowDown } from "react-icons/md";
import repairImg from "../assets/repair.png";
import timingImg from "../assets/timing.png";
import scheduleImg from "../assets/schedule.png";
import profilePic from "../assets/user.png";
import { useGetVehiclesByVINsMutation } from "../slices/vehicleApiSlice.js";
import AppointmentModal from "../components/AppointmentModal.jsx";
import { useViewAppointmentsQuery } from "../slices/appointmentSlice.js";
import { skipToken } from "@reduxjs/toolkit/query";

const UserHomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [vehicles, setVehicles] = useState([]);
  const [getVehiclesByVINs] = useGetVehiclesByVINsMutation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vin, setVin] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (userInfo.vehicles && userInfo.vehicles.length > 0) {
        const vinList = userInfo.vehicles.map((vehicle) => vehicle.vin);
        try {
          const response = await getVehiclesByVINs({ vins: vinList }).unwrap();
          setVehicles(response);
          setSelectedVehicle(response[0]);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      }
    };

    fetchVehicles();
  }, [userInfo.vehicles, getVehiclesByVINs]);

  useEffect(() => {
    if (selectedVehicle) {
      setVin(selectedVehicle.vin);
    }
  }, [selectedVehicle]);

  const {
    data: appointment,
    isLoading,
    error,
  } = useViewAppointmentsQuery(
    selectedVehicle?.vin ? selectedVehicle.vin : skipToken
  );

  const handleVehicleDropdownClick = () => {
    setShowVehicleDropdown(!showVehicleDropdown);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDropdown(false);
  };

  return (
    <div className="flex flex-row antialiased font-alata">
      <div className="px-16 pt-[3rem] w-full flex flex-col">
        <div className="flex flex-row">
          <div className="pr-5">
            <img
              src={profilePic}
              alt="profile pic"
              className="rounded-full w-[3.5rem] h-[3.5rem]"
            ></img>
          </div>
          <div>
            <div className="font-bold text-xl">Good Day, {userInfo.name}</div>
            <div className="font-light text-[#858585]">
              {selectedVehicle && selectedVehicle.name}
            </div>
          </div>
        </div>
        <div className="mt-12 text-lg text-[#858585]">Vehicle</div>
        <div className="relative">
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={handleVehicleDropdownClick}
          >
            <div className="font-semibold text-3xl mt-1">
              {selectedVehicle && selectedVehicle.name}
            </div>
            <div className="px-8 font-extrabold text-4xl">
              <MdKeyboardArrowDown
                size={30}
                className={`transform transition-transform duration-300 ${
                  showVehicleDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          {showVehicleDropdown && (
            <div className="absolute z-20 mt-1 bg-white border border-gray-400 rounded-md shadow-lg top-10">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.vin}
                  className="block px-10 py-2 cursor-pointer hover:bg-gray-100 dark:bg-dark-2"
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  {vehicle.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-lg text-gray-600">
          {selectedVehicle && selectedVehicle.carPlate}
        </div>

        <div className="flex flex-row gap-8">
          <div class="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-[18rem]">
            <div class="p-8">
              <img
                src={repairImg}
                alt="repair"
                className="w-12 h-12 mb-4 text-gray-900"
              ></img>
              <h5 class="block mb-1  text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                {selectedVehicle && selectedVehicle.nextServiceDate}
              </h5>
              <p class="block  text-base antialiased text-[#858585] leading-relaxed text-inherit">
                Next Service Date
              </p>
            </div>
          </div>

          <div class="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-[18rem] ">
            <div class="p-8">
              <img
                src={timingImg}
                alt="repair"
                className="w-12 h-12 mb-4 text-gray-900"
              ></img>
              <h5 class="block mb-1 text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                {selectedVehicle && selectedVehicle.nextServiceRange} km
              </h5>
              <p class="block text-base antialiased text-[#858585] leading-relaxed text-inherit">
                Next Service Mileage
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-[38rem] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="p-8">
            <img
              src={scheduleImg}
              alt="repair"
              className="w-12 h-12 mb-4 text-gray-900"
            ></img>
            <h5 className="block mb-1  text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              View Appointment
            </h5>
            <p className="block  text-base antialiased text-[#858585] leading-relaxed text-inherit">
              Check your booked appointment here
            </p>
          </div>
        </div>
      </div>
      {selectedVehicle?.premium ? (
        <Model selectedVehicle={selectedVehicle} />
      ) : (
        <img
          src={selectedVehicle?.image}
          alt={selectedVehicle?.name}
          className="w-4/5 h-3/4 object-cover mt-[10rem] px-2"
        />
      )}
      <AppointmentModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        appointment={appointment}
      />
    </div>
  );
};

export default UserHomePage;
