import React, { useState } from "react";
import { useGetAllFeedbacksQuery } from "../../slices/usersApiSlice";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import FeedbackModal from "../../components/FeedbackModal";

const AdminFeedbackPage = () => {
  const { data: feedbacks = [], isLoading } = useGetAllFeedbacksQuery();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const emojiCounts = feedbacks.reduce((acc, feedback) => {
    const emoji = feedback.selectedEmoji;
    if (acc[emoji]) {
      acc[emoji] += 1;
    } else {
      acc[emoji] = 1;
    }
    return acc;
  }, {});

  const data = {
    labels: Object.keys(emojiCounts),
    datasets: [
      {
        data: Object.values(emojiCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12">
      <div className="w-full flex justify-center h-64 mb-8">
        <Doughnut data={data} />
      </div>
      <div className="flex flex-col bg-white overflow-y-auto p-4 h-[21rem]">
        <div className="w-full mb-4 md:mb-0 md:pr-4">
          <ul className="">
            {feedbacks.map((feedback) => (
              <li
                key={feedback._id}
                className="w-full border-b-2 p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedFeedback(feedback)}
              >
                <div className="flex gap-2">
                  <p className="font-bold truncate w-[12rem]">
                    {feedback.user.name}
                  </p>
                  <p className="truncate w-12">{feedback.selectedEmoji}</p>
                  <p className="font-semibold truncate w-[13rem]">
                    {feedback.subject}
                  </p>
                  <p className="truncate w-96">{feedback.content}</p>
                  <p className="px-8 text-gray-700 truncate w-48">
                    {new Date(feedback.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedFeedback && (
        <FeedbackModal
          isOpen={!!selectedFeedback}
          setIsOpen={setSelectedFeedback}
          feedback={selectedFeedback}
        />
      )}
    </div>
  );
};

export default AdminFeedbackPage;
