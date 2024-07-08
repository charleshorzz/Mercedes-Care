import React from "react";
import { useDeleteVehicleMutation } from "../slices/vehicleApiSlice";
import Delete from "../assets/delete.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const VehicleCard = ({ imgSrc, vin, name, carPlate }) => {
  const [deleteVehicle] = useDeleteVehicleMutation();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const response = await deleteVehicle(vin).unwrap();
      const updatedUser = response.user;
      // Optionally, trigger a refetch or update local state to show the new vehicle in the UI
      dispatch(setCredentials({ ...updatedUser }));
      toast.success("Vehicle deleted");
      // Optionally, trigger a refetch or update local state to remove the deleted vehicle from the UI
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      message: "Are you sure you want to delete this vehicle?",
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
    <div className="relative w-[20rem] h-[19rem] border border-gray-100 rounded-2xl shadow-lg group hover:border-gray-300">
      <div className="w-[18rem] h-[11rem] pt-4 mx-5 flex justify-center">
        <img
          src={imgSrc}
          alt="vehicle"
          className="transition-transform group-hover:scale-110 duration-200 bg-cover"
        />
        <img
          src={Delete}
          alt="deleteBtn"
          className="absolute top-4 right-4 w-5 h-5 z-3 cursor-pointer"
          onClick={confirmDelete}
        />
      </div>
      <div className="mt-2 flex flex-col items-center">
        <div className="p-4 text-black text-center">
          <div className="text-xl font-semibold">{name}</div>
          <div className="text-base my-1">{carPlate}</div>
          <div className="text-gray-400 my-1">{vin}</div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
