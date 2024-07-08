import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreateFeedbackMutation } from "../slices/usersApiSlice";

const FeedbackSection = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😃");
  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  const handleSubmit = async () => {
    try {
      await createFeedback({ subject, content, selectedEmoji }).unwrap();
      toast.success("Feedback submitted successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="py-3 px-5">
          <i className="fas fa-times cursor-pointer text-gray-400 text-xl absolute top-5 right-5"></i>
          <div className="text-center text-xl font-bold text-gray-900">
            How was your experience in Mercedes-CARE today?
          </div>
          <ul className="flex gap-7 justify-center my-5">
            <li
              className={`cursor-pointer w-20 h-20 bg-white transition duration-300 rounded-lg flex justify-center items-center text-5xl ${
                selectedEmoji === "🙁" ? "shadow-lg" : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedEmoji("🙁")}
            >
              🙁
            </li>
            <li
              className={`cursor-pointer w-20 h-20 bg-white transition duration-300 rounded-lg flex justify-center items-center text-5xl ${
                selectedEmoji === "😐" ? "shadow-lg" : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedEmoji("😐")}
            >
              😐
            </li>
            <li
              className={`cursor-pointer w-20 h-20 bg-white transition duration-300 rounded-lg flex justify-center items-center text-5xl ${
                selectedEmoji === "😃" ? "shadow-lg" : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedEmoji("😃")}
            >
              😃
            </li>
          </ul>
        </div>
        <div className="px-5 flex gap-8 w-full">
          <div>
            <label className="block font-medium text-gray-700">Subject</label>
            <input
              type="text"
              className="mt-1 block w-[68rem] px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="The staff is friendly..."
            />
          </div>
        </div>
        <div className="px-5 mt-6">
          <label className="block font-medium text-gray-700">Content</label>
          <textarea
            rows="5"
            className="mt-1 block w-[68rem] h-48 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="They treated me politely..."
          />
        </div>
        <div className="w-full mx-[30rem] mt-4">
          <button
            className="border-secondary border rounded-md inline-flex bg-[#00A19B] items-center justify-center py-2 px-8 text-center text-base font-medium text-white hover:bg-[#006e4f] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 transition-all duration-150"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting" : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default FeedbackSection;
