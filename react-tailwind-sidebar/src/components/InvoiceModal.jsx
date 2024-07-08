import { AnimatePresence, motion } from "framer-motion";

const InvoiceModal = ({ isOpen, setIsOpen, history, userInfo }) => {
  if (!history) return null;

  const getAmountPaid = (type) => {
    switch (type) {
      case "Major Service":
        return 900;
      case "Regular Service":
        return 500;
      case "Checking":
        return 100;
      default:
        return 0;
    }
  };

  const amountPaid = getAmountPaid(history.type);

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
            className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <div className="relative z-10 bg-white border rounded-lg shadow-lg px-6 py-8 max-w-md mx-auto mt-8">
              <h1 className="font-bold text-2xl my-4 text-center text-blue-600">
                MERCEDES-CARE
              </h1>
              <hr className="mb-2" />
              <div className="flex justify-between mb-6">
                <h1 className="text-lg text-black font-bold">Invoice</h1>
                <div className="text-gray-700">
                  <div>
                    Date: {new Date(history.createdAt).toLocaleDateString()}
                  </div>
                  <div>Invoice Id: {history._id}</div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 text-black">Bill To:</h2>
                <div className="text-gray-700 mb-2">{userInfo.name}</div>
                <div className="text-gray-700">{userInfo.email}</div>
              </div>
              <table className="w-full mb-8">
                <thead>
                  <tr>
                    <th className="text-left font-bold text-gray-700">
                      Description
                    </th>
                    <th className="text-right font-bold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-left text-gray-700">{history.type}</td>
                    <td className="text-right text-gray-700">
                      RM{amountPaid}.00
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="text-left font-bold text-gray-700">Total</td>
                    <td className="text-right font-bold text-gray-700">
                      RM{amountPaid}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="text-gray-700 mb-2">
                Thank you for your visit!
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-gray-50 transition-colors text-black font-semibold w-full py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvoiceModal;
