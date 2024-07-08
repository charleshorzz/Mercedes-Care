import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SecuritySection = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [phone, setPhone] = useState(userInfo.phone);

  return (
    <div>
      <form>
        <div className="mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex gap-8 items-center">
              <input
                type="email"
                className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={userInfo.email}
                readOnly
              />
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-gray-700 underline"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex gap-8 items-center">
              <input
                type="password"
                className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                readOnly
              />
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-gray-700 underline"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SecuritySection;
