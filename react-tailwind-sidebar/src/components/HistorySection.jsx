import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Table } from "flowbite-react";
import InvoiceModal from "./InvoiceModal";
import { useGetServiceHistoryByVehicleQuery } from "../slices/appointmentSlice.js";
import { useSelector } from "react-redux";
import { useGetVehiclesByVINsMutation } from "../slices/vehicleApiSlice.js";

const HistorySection = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [vehicles, setVehicles] = useState([]);
  const [getVehiclesByVINs] = useGetVehiclesByVINsMutation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (userInfo.vehicles && userInfo.vehicles.length > 0) {
        const vinList = userInfo.vehicles.map((vehicle) => vehicle.vin);
        try {
          const response = await getVehiclesByVINs({ vins: vinList }).unwrap();
          setVehicles(response);
          if (response.length > 0) {
            setSelectedVehicle(response[0]);
          }
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      }
    };

    fetchVehicles();
  }, [userInfo.vehicles, getVehiclesByVINs]);

  const handleVehicleDropdownClick = () => {
    setShowVehicleDropdown(!showVehicleDropdown);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDropdown(false);
  };

  const {
    data: serviceHistory,
    isLoading,
    isError,
  } = useGetServiceHistoryByVehicleQuery(selectedVehicle?._id);

  const handleViewInvoice = (history) => {
    setSelectedHistory(history);
    setIsOpen(true);
  };

  return (
    <>
      <div className="px-5">
        <div className="relative">
          <div className="flex flex-row items-center">
            <div
              className="font-semibold text-2xl mt-1 cursor-pointer"
              onClick={handleVehicleDropdownClick}
            >
              {selectedVehicle && selectedVehicle.name}
            </div>
            <div className="px-4 font-extrabold text-2xl">
              <MdKeyboardArrowDown
                size={30}
                className={`transform transition-transform duration-300 ${
                  showVehicleDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          {showVehicleDropdown && (
            <div className="absolute z-20 mt-1 bg-white border border-gray-400 rounded-md shadow-lg top-10 w-48">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="block px-10 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  {vehicle.name}
                </div>
              ))}
            </div>
          )}
          <div className="text-gray-500 text-base mt-1">
            {selectedVehicle && selectedVehicle.carPlate}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mt-4 rounded-2xl px-4">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Service Center</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Service Type</Table.HeadCell>
            <Table.HeadCell>Invoices</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Error loading service history
                </td>
              </tr>
            ) : serviceHistory && serviceHistory.length > 0 ? (
              serviceHistory.map((history) => (
                <Table.Row
                  key={history._id}
                  className="bg-white border-gray-200"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                    {history.serviceCenter}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(history.date).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{history.type}</Table.Cell>
                  <Table.Cell>
                    <div
                      onClick={() => handleViewInvoice(history)}
                      className="font-medium text-cyan-600 hover:underline hover:font-semibold cursor-pointer"
                    >
                      View
                    </div>
                    <InvoiceModal
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      history={selectedHistory}
                      userInfo={userInfo}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-lg py-4">
                  No service history found
                </td>
              </tr>
            )}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default HistorySection;
