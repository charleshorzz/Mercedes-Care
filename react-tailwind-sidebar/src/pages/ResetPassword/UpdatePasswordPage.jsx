import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import backgroundImg from "../../assets/login-background.jpg";
import { SiMercedes } from "react-icons/si";
import { useUpdatePasswordMutation } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = location.state || {};

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/userHomePage");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      console.log(email);
      try {
        const res = await updatePassword({ email, password });
        console.log(res);
        toast.success("Password updated successfully");
        navigate("/login");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  return (
    <div
      className="text-white h-[100vh] flex justify-center items-center bg-cover bg-opacity-50"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm backdrop-filter bg-opacity-30 relative">
        <div className="flex flex-row">
          <div className="px-[6.2rem] mb-8">
            <SiMercedes size={30} />
          </div>
        </div>
        <h1 className="text-4xl text-white font-bold text-center mb-6">
          Update Password
        </h1>
        {isLoading && <Loader />}
        <form onSubmit={submitHandler}>
          <div className="relative my-4">
            <input
              type={showPassword ? "text" : "password"}
              className="block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              placeholder=""
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
            <label
              htmlFor=""
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Password
            </label>
            {showPassword ? (
              <IoEyeSharp
                className="absolute top-3 right-4 cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <BsEyeSlashFill
                className="absolute top-3 right-4 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </div>
          <div className="relative my-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              placeholder=""
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="off"
            />
            <label
              htmlFor=""
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Your Password
            </label>
            {showConfirmPassword ? (
              <IoEyeSharp
                className="absolute top-3 right-4 cursor-pointer"
                onClick={toggleShowConfirmPassword}
              />
            ) : (
              <BsEyeSlashFill
                className="absolute top-3 right-4 cursor-pointer"
                onClick={toggleShowConfirmPassword}
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
            disabled={isLoading}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
