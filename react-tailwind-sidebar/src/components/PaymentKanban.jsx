import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentByAdminMutation,
  useUpdateAppointmentIsPaidMutation, // Add this import
} from "../slices/appointmentSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector } from "react-redux";

const serviceTypePrices = {
  "Major Service": 900,
  "Regular Service": 500,
  Checking: 100,
};

const PaymentKanban = () => {
  const { data: appointments, isLoading, refetch } = useGetAppointmentsQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Filter appointments by admin's location
  const filteredAppointments = appointments?.filter(
    (appointment) => appointment.location === userInfo?.location
  );

  const totalIncome = filteredAppointments?.reduce((sum, app) => {
    return sum + (serviceTypePrices[app.type] || 0);
  }, 0);

  return (
    <div className="h-full w-full bg-white text-black p-4">
      <div className="flex justify-between mb-4">
        <div className="text-xl font-bold">
          Total Income: RM {totalIncome.toFixed(2)}
        </div>
      </div>
      {filteredAppointments && filteredAppointments.length > 0 ? (
        <Board appointments={filteredAppointments} />
      ) : (
        <div>No appointments found.</div>
      )}
    </div>
  );
};

const Board = ({ appointments }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(appointments);
  }, [appointments]);

  const groupedAppointments = {
    "Waiting For Payment": cards.filter((app) => !app.isPaid),
    Paid: cards.filter((app) => app.isPaid),
  };

  return (
    <div className="flex h-full w-full gap-3 text-lg overflow-auto p-4">
      {Object.keys(groupedAppointments).map((status) => (
        <Column
          key={status}
          title={status}
          column={status.toLowerCase().replace(" ", "-")}
          headingColor="text-black"
          cards={groupedAppointments[status]}
          setCards={setCards}
          allCards={cards}
        />
      ))}
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards, allCards }) => {
  const [active, setActive] = useState(false);
  const [updateAppointmentIsPaid] = useUpdateAppointmentIsPaidMutation(); // Add this hook
  const [deleteAppointmentByAdmin] = useDeleteAppointmentByAdminMutation();

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card._id);
    e.dataTransfer.setData("currentColumn", card.isPaid ? "paid" : "not-paid");
  };

  const handleDrop = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    const currentColumn = e.dataTransfer.getData("currentColumn");

    setActive(false);
    clearHighlights();

    const updatedCards = allCards.map((card) => {
      if (card._id === cardId) {
        if (column === "paid") {
          // Update isPaid status
          updateAppointmentIsPaid({ id: cardId });
          return { ...card, isPaid: true };
        }
        return card;
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
      message:
        "Are you sure you want to delete the payment record of the appointment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleRemove(id), // Pass the function as a callback
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div
      className="w-1/2"
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
  isPaid,
  handleDragStart,
  currentColumn,
  onRemove,
}) => {
  const formattedDate = formatDate(date);

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
            isPaid,
          })
        }
        className="relative cursor-grab rounded border border-gray-300 bg-white p-3 shadow-sm active:cursor-grabbing"
      >
        <button
          onClick={() => onRemove(_id)}
          className="absolute text-3xl top-0 right-4 p-1 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <p className="text-2xl text-black my-1">{user.name}</p>
        <p className="text-sm text-gray-500 my-1">{vin}</p>
        <p className="text-sm text-gray-500 my-1">Date: {formattedDate}</p>
        <p className="text-sm text-gray-500 my-1">Time: {time}</p>
        <p className="text-sm text-gray-500 my-1">Type: {type}</p>
        <p className="text-sm text-gray-500 my-1">Location: {location}</p>
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

export default PaymentKanban;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
