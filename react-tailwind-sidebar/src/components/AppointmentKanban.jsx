import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  useGetAppointmentsByDateQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentByAdminMutation,
  useAssignMechanicToAppointmentMutation,
} from "../slices/appointmentSlice";
import { useGetMechanicsQuery } from "../slices/usersApiSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector } from "react-redux";

const AppointmentKanban = ({ selectedDate, isMechanic = false }) => {
  const {
    data: appointments = [],
    isLoading,
    error,
    refetch,
  } = useGetAppointmentsByDateQuery(selectedDate);
  const { userInfo } = useSelector((state) => state.auth);
  const { data: mechanics, isLoading: loadingMechanics } =
    useGetMechanicsQuery();
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  useEffect(() => {
    if (appointments) {
      const filtered = appointments.filter(
        (appointment) =>
          appointment.location === userInfo?.location &&
          (!isMechanic || appointment.assignedTo === userInfo._id)
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [appointments, userInfo, isMechanic]);

  if (isLoading || loadingMechanics) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>No appointments found.</div>;
  }

  return (
    <div className="h-full w-full bg-white text-black p-4">
      {filteredAppointments.length > 0 ? (
        <Board
          appointments={filteredAppointments}
          mechanics={mechanics || []}
        />
      ) : (
        <div>No appointments found.</div>
      )}
    </div>
  );
};

const Board = ({ appointments, mechanics }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(appointments);
  }, [appointments]);

  const groupedAppointments = {
    Scheduled: cards.filter((app) => app.status === "scheduled"),
    "In-Progress": cards.filter((app) => app.status === "in-progress"),
    Completed: cards.filter((app) => app.status === "completed"),
  };

  return (
    <div className="flex h-full w-full gap-3 text-lg overflow-auto p-4">
      {Object.keys(groupedAppointments).map((status) => (
        <Column
          key={status}
          title={status.replace(/-/g, " ")}
          column={status.toLowerCase()}
          headingColor="text-black"
          cards={groupedAppointments[status]}
          setCards={setCards}
          allCards={cards}
          mechanics={mechanics}
        />
      ))}
    </div>
  );
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  allCards,
  mechanics,
}) => {
  const [active, setActive] = useState(false);
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  const [deleteAppointmentByAdmin] = useDeleteAppointmentByAdminMutation();
  const [assignMechanicToAppointment] =
    useAssignMechanicToAppointmentMutation();

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card._id);
    e.dataTransfer.setData("currentColumn", card.status);
  };

  const handleDrop = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    const currentColumn = e.dataTransfer.getData("currentColumn");

    setActive(false);
    clearHighlights();

    const updatedCards = allCards.map((card) => {
      if (card._id === cardId) {
        const updatedCard = { ...card, status: column };
        updateAppointmentStatus({ id: cardId, status: column });
        return updatedCard;
      }
      return card;
    });

    setCards(updatedCards);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleRemove = async (appointmentId) => {
    try {
      await deleteAppointmentByAdmin(appointmentId).unwrap();
      setCards(cards.filter((card) => card._id !== appointmentId));
    } catch (error) {
      console.error("Failed to delete the appointment:", error);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      message: "Are you sure you want to delete the appointment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleRemove(id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleAssign = async (appointmentId, mechanicId) => {
    try {
      const updatedAppointment = await assignMechanicToAppointment({
        id: appointmentId,
        mechanicId,
      }).unwrap();

      const mechanic = mechanics?.find((m) => m._id === mechanicId);

      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === updatedAppointment._id
            ? {
                ...updatedAppointment,
                mechanicName: mechanic?.name,
                vehicle: card.vehicle,
                status: "in-progress",
              }
            : card
        )
      );
    } catch (error) {
      console.error("Failed to assign mechanic:", error);
    }
  };

  return (
    <div
      className="w-1/3"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-gray-500">{cards.length}</span>
      </div>
      <div
        className={`h-full w-full transition-colors ${
          active ? "bg-gray-200" : "bg-gray-100"
        }`}
      >
        {cards.map((c) => {
          return (
            <Card
              key={c._id}
              {...c}
              handleDragStart={handleDragStart}
              currentColumn={column}
              onRemove={confirmDelete}
              onAssign={handleAssign}
              mechanics={mechanics}
              mechanicName={c.mechanicName}
              assignedTo={c.assignedTo}
            />
          );
        })}
        <DropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};

const Card = ({
  _id,
  user,
  vin,
  date,
  type,
  location,
  time,
  vehicle,
  handleDragStart,
  currentColumn,
  onRemove,
  onAssign,
  mechanics,
  mechanicName,
  assignedTo,
}) => {
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);

  const toggleAssignDropdown = () => {
    setAssignDropdownOpen((prev) => !prev);
  };

  const handleAssign = (mechanicId) => {
    onAssign(_id, mechanicId);
    toggleAssignDropdown();
  };

  const assignedMechanic = assignedTo
    ? mechanics?.find((m) => m._id === assignedTo)
    : null;

  return (
    <>
      <DropIndicator beforeId={_id} column={currentColumn} />
      <motion.div
        layout
        layoutId={_id}
        draggable="true"
        onDragStart={(e) =>
          handleDragStart(e, {
            _id,
            user,
            vin,
            date,
            type,
            location,
            time,
            status: currentColumn,
          })
        }
        className="relative cursor-grab rounded border border-gray-300 bg-white p-3 shadow-sm active:cursor-grabbing"
      >
        <button
          onClick={() => onRemove(_id)}
          className="absolute top-0 right-2 p-1 text-gray-500 hover:text-gray-700 text-3xl"
        >
          ×
        </button>
        <p className="text-2xl text-black my-1">{user.name}</p>
        <p className="text-sm text-gray-500 my-1">
          {vehicle?.vin || "Vehicle Vin"}
        </p>
        <p className="text-sm text-gray-500 my-1">
          {vehicle?.name || "Vehicle Name"}
        </p>
        <p className="text-sm text-gray-500 my-1">
          {vehicle?.carPlate || "Car Plate"}
        </p>
        <p className="text-sm text-gray-500 my-1">Time: {time}</p>
        <p className="text-sm text-gray-500 my-1">Type: {type}</p>
        {assignedMechanic ? (
          <p className="text-sm text-gray-500 my-1">
            Assigned: {assignedMechanic.name}
          </p>
        ) : (
          currentColumn === "scheduled" && (
            <div className="relative">
              <button
                onClick={toggleAssignDropdown}
                className="text-blue-500 underline flex items-center"
              >
                Assign
                <MdKeyboardArrowDown
                  size={24}
                  className={`transform transition-transform duration-300 ${
                    assignDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {assignDropdownOpen && (
                <div className="absolute bg-white border mt-2 p-2 rounded shadow-lg z-10">
                  {mechanics?.map((mechanic) => (
                    <div
                      key={mechanic._id}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                      onClick={() => handleAssign(mechanic._id)}
                    >
                      {mechanic.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

export default AppointmentKanban;
