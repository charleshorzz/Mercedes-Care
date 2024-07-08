import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import UpdatePasswordModal from "./updatePasswordModal";

const InfoSection = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [phone, setPhone] = useState(userInfo.phone);
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [updateUser] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({
        id: userInfo._id,
        data: { name, email, password, phone },
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (res.isAdmin) {
        navigate("/adminSettingsPage");
      } else {
        navigate("/settings");
      }
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <>
      <div className="px-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex gap-8 items-center">
                <input
                  type="email"
                  className="mt-1 block w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="mt-2 bg-[#00A19B] text-white p-2 rounded-lg w-24 hover:bg-[#006e4f] "
            >
              Update
            </button>
          </div>
        </form>
        <UpdatePasswordModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default InfoSection;
