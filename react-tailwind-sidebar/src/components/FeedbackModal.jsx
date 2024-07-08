import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import ReplyModal from "./ReplyModal";

const FeedbackModal = ({ isOpen, setIsOpen, feedback }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

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

  const handleReply = () => {
    setIsReplyModalOpen(true);
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
            <div className="relative z-10">
              <div className="flex gap-4">
                <h3 className="text-xl font-bold mb-2">{feedback.user.name}</h3>
                <p className=" text-xl">{feedback.selectedEmoji}</p>
              </div>
              <p className="text-gray-600 mb-4">
                {formatDateToMalaysia(feedback.date)}
              </p>
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <div className="mb-4">
                  <span className="font-bold text-2xl">{feedback.subject}</span>
                </div>
                <div className="mb-2">
                  <div
                    className="text-gray-700"
                    style={{ wordBreak: "break-all" }}
                  >
                    {feedback.content}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 transition-colors text-black font-semibold w-full py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={handleReply}
                  className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Reply
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {isReplyModalOpen && (
        <ReplyModal
          isOpen={isReplyModalOpen}
          setIsOpen={setIsReplyModalOpen}
          feedback={feedback}
        />
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
