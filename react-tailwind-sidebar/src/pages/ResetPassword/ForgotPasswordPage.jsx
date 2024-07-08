import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineUnlock, AiOutlineMail } from "react-icons/ai";
// useDispatch to dispatch actions, like login action, where selector is used to obtain data from state
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import backgroundImg from "../../assets/login-background.jpg";
import { SiMercedes } from "react-icons/si";
import { FaArrowLeft } from "react-icons/fa";
import { useSendRecoveryEmailMutation } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sendRecoveryEmail, { isLoading }] = useSendRecoveryEmailMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/userHomePage");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await sendRecoveryEmail({ email }).unwrap();
      const { _id: userId } = res;
      console.log(userId);
      if (userId) {
        navigate("/verifypw", { state: { userId, email } });
        toast.success("Verification code has been sent to your email");
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <div
        className="text-white h-[100vh] flex justify-center items-center bg-cover bg-opacity-50"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm backdrop-filter bg-opacity-30 relative">
          <div className="flex flex-row">
            <Link to="/login" className="pt-[0.3rem] px-1">
              <FaArrowLeft size={20} />
            </Link>
            <div className="px-[6.2rem] mb-8">
              <SiMercedes size={30} />
            </div>
          </div>
          <h1 className="text-4xl text-whitefont-bold text-center mb-6">
            Reset Password
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
            <button
              type="submit"
              className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
              disabled={isLoading}
            >
              Send Code
            </button>
            <div>
              <span className="m-4">
                Remembered your password?{" "}
                <Link
                  className="text-blue-500  hover:text-blue-700 transition-colors duration-150 px-2"
                  to="/login"
                >
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
