import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import backgroundImg from "../assets/login-background.jpg";
import { SiMercedes } from "react-icons/si";
import Loader from "../components/Loader";

const Login = () => {
  console.log("Login rendered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate("/adminHomePage");
      } else if (userInfo.isMechanic) {
        navigate("/mechanicHomePage");
      } else {
        navigate("/userHomePage");
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Login Success");
      if (res.isAdmin) {
        navigate("/adminHomePage");
      } else if (res.isMechanic) {
        navigate("/mechanicHomePage");
      } else {
        navigate("/userHomePage");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div
      className="text-white h-[100vh] flex justify-center items-center bg-cover bg-opacity-50"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm backdrop-filter bg-opacity-30 relative">
        <div className="flex flex-row">
          <Link to="/" className="pt-[0.3rem] px-1">
            <FaArrowLeft size={20} />
          </Link>
          <div className="px-[6.2rem] mb-8">
            <SiMercedes size={30} />
          </div>
        </div>
        <h1 className="text-4xl text-white font-bold text-center mb-6">
          Login
        </h1>
        {isLoading && <Loader />}
        <form onSubmit={submitHandler}>
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
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="" id="" checked="true" />
              <label htmlFor="Remember Me">Remember Me</label>
            </div>
            <Link
              to="/forgotpw"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
            disabled={isLoading}
          >
            Login
          </button>
          <div>
            <span className="m-4">
              New Here?{" "}
              <Link
                className="text-blue-500 hover:text-blue-700 transition-colors duration-150 px-2"
                to="/register"
              >
                Create an account
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
