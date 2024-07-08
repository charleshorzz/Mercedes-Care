import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import poster from "../assets/poster.png";
import pfp from "../assets/user.png";
import InfoSection from "../components/InfoSection";
import FeedbackSection from "../components/FeedbackSection";
import VehicleCard from "../components/VehicleSection";
import addBtn from "../assets/addBtn.png";
import ModalBox from "../components/ModalBox";
import HistorySection from "../components/HistorySection";
import camera from "../assets/camera.png";
import { useGetVehiclesByVINsMutation } from "../slices/vehicleApiSlice";

const tabs = [
  { id: "info", label: "Personal Info" },
  { id: "feedback", label: "Feedback" },
  { id: "vehicle", label: "Vehicles" },
  { id: "history", label: "Service History" },
];

const SettingsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("info");
  const [isOpen, setIsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(pfp);
  const [vehicles, setVehicles] = useState([]);
  const [getVehiclesByVINs] = useGetVehiclesByVINsMutation();

  useEffect(() => {
    const fetchVehicles = async () => {
      if (userInfo.vehicles && userInfo.vehicles.length > 0) {
        const vinList = userInfo.vehicles.map((vehicle) => vehicle.vin);
        console.log("Fetching vehicles with VINs:", vinList); // Debug log
        try {
          const response = await getVehiclesByVINs({ vins: vinList }).unwrap();
          console.log("Fetched vehicles data:", response); // Debug log
          setVehicles(response);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      }
    };

    fetchVehicles();
  }, [userInfo.vehicles, getVehiclesByVINs]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoSection />;
      case "feedback":
        return <FeedbackSection />;
      case "vehicle":
        return (
          <div className="mt-2 px-5 pb-2 w-[74rem] overflow-x-auto scrollbar-hide scroll-smooth">
            <div className="flex space-x-8">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.vin}
                  imgSrc={vehicle.image} // Ensure you have a valid image source
                  name={vehicle.name}
                  carPlate={vehicle.carPlate}
                  vin={vehicle.vin}
                />
              ))}
              <button
                className="relative w-[20rem] h-[19rem] border bg-gray-200 border-gray-100 rounded-2xl shadow-lg group hover:border-gray-300"
                onClick={() => setIsOpen(true)}
              >
                <div className="w-[18rem] h-[11rem] pt-5 mx-5 flex justify-center items-center">
                  <img
                    src={addBtn}
                    alt="addBtn"
                    className="transition-transform group-hover:scale-110 duration-200 w-16 h-16"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-4 text-black text-center">
                    Add New Vehicle
                  </div>
                </div>
                <ModalBox isOpen={isOpen} setIsOpen={setIsOpen} />
              </button>
            </div>
          </div>
        );
      case "history":
        return <HistorySection />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-1 w-[85%] h-full py-8 mx-20 font-dmsans">
        <div className="bg-white rounded-sm shadow-lg">
          <div className="relative">
            <img
              src={poster}
              alt="Poster"
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="flex items-center space-x-40">
              <div>
                <img
                  src={profilePic}
                  alt="Profile"
                  className="absolute top-32 left-6 w-[6.5rem] h-[6.5rem] rounded-full border-4 border-white bg-gray-100"
                />
                <input
                  type="file"
                  id="profilePicInput"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
                <label
                  htmlFor="profilePicInput"
                  className="absolute top-[10.5rem] left-[4rem] w-16 h-16 bg-transparant rounded-full cursor-pointer"
                >
                  <img src={camera} alt="cameraImg" className="w-6 h-6" />
                </label>
              </div>

              <div className="text-3xl font-bold mt-4">{userInfo.name}</div>
              <div className="absolute mt-3 flex gap-2 top-[10.2rem] right-6">
                <button className="border-secondary border rounded-md inline-flex items-center justify-center py-2 px-5 text-center text-base font-medium text-secondary hover:bg-[#00A19B] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 transition-all duration-150">
                  Cancel
                </button>
                <button className="border-secondary border rounded-md inline-flex bg-[#00A19B] items-center justify-center py-2 px-5 text-center text-base font-medium text-white hover:bg-[#006e4f] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 transition-all duration-150">
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 font-medium">
            <div className="border-b border-gray-200 relative">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-4 px-1 border-b-2 ${
                      activeTab === tab.id
                        ? "border-transparent text-black-700 font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    } text-sm font-medium relative`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="highlight"
                        className="absolute inset-0 border-b-2 border-indigo-600"
                      />
                    )}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-6 h-[20.5rem] overflow-y-auto scrollbar-hide scroll-smooth">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
