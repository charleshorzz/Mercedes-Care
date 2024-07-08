import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImg from "../assets/login-background.jpg";
import { SiMercedes } from "react-icons/si";
import { useVerifyMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { userId } = location.state || {};

  const [verify, { isLoading }] = useVerifyMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/userHomePage");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    try {
      const res = await verify({ userId, otpValue }).unwrap();
      if (res.status === "VERIFIED") {
        navigate("/login", { state: { userId } });
        toast.success("Vefication success");
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
    // handle OTP submission here, e.g., send otpValue to the server
  };

  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  return (
    <div
      className="text-white h-[100vh] flex flex-col justify-center items-center bg-cover bg-opacity-50"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="my-6">{isLoading && <Loader />}</div>
      <div className="bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm backdrop-filter bg-opacity-30 relative h-[17rem]">
        <div className="px-[5.5rem]">
          <SiMercedes size={30} />
        </div>
        <section className="py-7 dark:bg-dark">
          <div className="container">
            <div>
              <p className="mb-2.5 text-sm font-medium text-white dark:text-white">
                Enter OTP Code
              </p>
              <form onSubmit={submitHandler}>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="flex items-center justify-center rounded-lg border border-stroke bg-white p-2 text-lg font-medium text-black outline-none dark:border-dark-3 dark:bg-white w-12 h-12 text-center"
                      value={otp[index]}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300"
                  disabled={isLoading}
                >
                  Verify
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VerificationPage;
