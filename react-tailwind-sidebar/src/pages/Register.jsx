import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiUser, BiPhone } from "react-icons/bi";
import { AiOutlineUnlock, AiOutlineMail } from "react-icons/ai";
import PhoneInput from "react-phone-number-input/input";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import backgroundImg from "../assets/login-background.jpg";
import { SiMercedes } from "react-icons/si";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import Loader from "../components/Loader";
import { FaCar } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vin, setVin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        const res = await register({
          name,
          email,
          password,
          phone,
          vin,
        }).unwrap();
        const userId = res._id; // Adjust this based on the actual response structure
        console.log(userId);
        navigate("/verify", { state: { userId } });
        toast.success(
          "Register successful, Check your email inbox for verification code"
        );
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <div
      className="text-white h-[100vh] flex justify-center items-center bg-cover bg-opacity-50"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm backdrop-filter bg-opacity-30 relative">
        <div className="px-[7.7rem] mb-8">
          <SiMercedes size={30} />
        </div>
        <h1 className="text-4xl text-white font-bold text-center mb-6">
          Register{" "}
        </h1>
        {isLoading && <Loader />}
        <form onSubmit={submitHandler} autoComplete="off">
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              placeholder=""
              name="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
            />
            <label
              htmlFor=""
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Name
            </label>
            <BiUser className="absolute top-3 right-4" />
          </div>
          <div className="relative my-4">
            <input
              type="email"
              className="block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              placeholder=""
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
            <label
              htmlFor=""
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Email
            </label>
            <AiOutlineMail className="absolute top-3 right-4" />
          </div>
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
          <div className="relative my-4">
            <PhoneInput
              className="block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              placeholder=""
              country="MY"
              value={phone}
              onChange={setPhone}
              name="phone"
              autoComplete="off"
            />
            <label
              htmlFor=""
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Phone Number
            </label>
            <BiPhone className="absolute top-3 right-4" />
          </div>
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
              placeholder=""
              name="vin"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              autoComplete="off"
            />
            <label
              htmlFor=""
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your VIN Number
            </label>
            <FaCar className="absolute top-3 right-4" />
          </div>
          <button
            type="submit"
            className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
            disabled={isLoading}
          >
            Register
          </button>
          <div>
            <span className="m-4">
              Already Create Account?{" "}
              <Link
                className="text-blue-500 hover:text-blue-700 transition-colors duration-150 px-2"
                to="/login"
              >
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
