import React, { useState, useEffect } from "react";
import carBg from "../assets/carBg.png";
import carModel from "../assets/carList.png";
import MaintenanceModal from "../components/MaintenanceModal";

const MaintenanceListPage = () => {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [ratedRange, setRatedRange] = useState(0);
  const [insideTemp, setInsideTemp] = useState(0);
  const [outsideTemp, setOutsideTemp] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetInsideTemp = 25; // Target value for inside temperature
  const targetOutsideTemp = 32; // Target value for outside temperature

  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryLevel((prev) => (prev < 70 ? prev + 1 : prev));
      setRatedRange((prev) => (prev < 85 ? prev + 1 : prev));
      setInsideTemp((prev) => (prev < targetInsideTemp ? prev + 1 : prev));
      setOutsideTemp((prev) => (prev < targetOutsideTemp ? prev + 1 : prev));
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4 font-alata">
        <div className="w-[60.2%] relative">
          <img src={carBg} alt="carBg" className="w-full h-full object-cover" />
          <img
            src={carModel}
            alt="carModel"
            className="absolute top-[27%] left-[40%] w-48 h-96"
          />

          <div className="absolute top-[35%] left-[18%]">
            <div className="w-[3.5rem] h-[3.5rem] p-2 bg-gradient-to-b from-[#00A19B] to-[#003B39] rounded-full flex items-center justify-center text-white">
              35psi
            </div>
            <div className="text-white text-xs mt-1 pr-4">L.FRONT TIRE</div>
          </div>
          <div className="absolute top-[38.5%] left-[25%] w-[8rem] h-[0.175rem] bg-gradient-to-r from-[#003B39] to-[#00A19B]"></div>

          <div className="absolute top-[35%] right-[15.5%]">
            <div className="w-[3.5rem] h-[3.5rem] p-2 bg-gradient-to-b from-[#00A19B] to-[#003B39] rounded-full flex items-center justify-center text-white">
              33psi
            </div>
            <div className="text-white text-xs mt-1 pr-4">R.FRONT TIRE</div>
          </div>
          <div className="absolute top-[38.5%] right-[26%] w-[8rem] h-[0.175rem] bg-gradient-to-l from-[#003B39] to-[#00A19B]"></div>

          <div className="absolute top-[58%] left-[18%]">
            <div className="w-[3.5rem] h-[3.5rem] p-2 bg-gradient-to-b from-[#00A19B] to-[#003B39] rounded-full flex items-center justify-center text-white">
              29psi
            </div>
            <div className="text-white text-xs mt-1 pr-4">L.REAR TIRE</div>
          </div>
          <div className="absolute top-[61.5%] left-[25%] w-[8rem] h-[0.175rem] bg-gradient-to-r from-[#003B39] to-[#00A19B]"></div>

          <div className="absolute top-[58%] right-[16.5%]">
            <div className="w-[3.5rem] h-[3.5rem] p-2 bg-gradient-to-b from-[#00A19B] to-[#003B39] rounded-full flex items-center justify-center text-white">
              31psi
            </div>
            <div className="text-white text-xs mt-1 pr-4">R.REAR TIRE</div>
          </div>
          <div className="absolute top-[62%] right-[26%] w-[8rem] h-[0.175rem] bg-gradient-to-l from-[#003B39] to-[#00A19B]"></div>
        </div>

        <div className="w-[35%] p-8 bg-white rounded-lg shadow-lg">
          <div className="text-3xl font-semibold mb-4">Specs</div>
          <div className="mb-6">
            <div className="text-xl font-semibold text-gray-700">
              Total Distance
            </div>
            <div className="mt-3 text-4xl font-bold text-[#00A19B] bg-gradient-to-r from-[#006E6A] to-[#00D4CC] inline-block text-transparent bg-clip-text">
              78 087KM
            </div>
          </div>
          <div className="mb-8">
            <div className="mb-2 text-xl font-semibold text-gray-700">
              Battery
            </div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Battery Level
              </div>
              <div className="text-sm font-medium text-gray-700">
                {batteryLevel}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-[#00A19B] h-2.5 rounded-full"
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
            <div className="mb-2 flex items-center justify-between">
              <div className=" mt-2 text-sm font-medium text-gray-700">
                Rated Range
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700">
                {ratedRange}ml
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-[#00A19B] h-2.5 rounded-full"
                style={{ width: `${ratedRange}%` }}
              ></div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-0.5 mb-8"></div>
          <div className="mt-4">
            <div className="text-xl font-semibold text-gray-700">
              Temperature
            </div>
            <div className="flex p-4 w-full justify-around mt-3">
              <div className="flex flex-col items-center ">
                <div className="mb-1 text-base font-medium text-gray-700">
                  Inside
                </div>
                <div className="text-[#00A19B] font-medium text-2xl">
                  {insideTemp}°C
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-1 text-base font-medium text-gray-700">
                  Outside
                </div>
                <div className="text-[#00A19B] font-medium text-2xl">
                  {outsideTemp}°C
                </div>
              </div>
            </div>
          </div>
          <button
            className="mt-6 w-full py-3 bg-[#00A19B] text-white rounded-lg hover:bg-[#007D76] transition duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Maintenance List
          </button>
        </div>
      </div>

      <MaintenanceModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default MaintenanceListPage;
