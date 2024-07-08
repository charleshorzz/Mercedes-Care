import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useReplyFeedbackMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const ReplyModal = ({ isOpen, setIsOpen, feedback }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [replyFeedback, { isLoading }] = useReplyFeedbackMutation();

  const handleSubmit = async () => {
    try {
      await replyFeedback({
        feedbackId: feedback._id,
        subject,
        content,
      }).unwrap();
      toast.success("Reply sent successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
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
              <h3 className="text-xl font-bold mb-4">
                Reply to {feedback.user.name}
              </h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 transition-colors text-black font-semibold w-full py-2 rounded"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold w-full py-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Submit"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReplyModal;
