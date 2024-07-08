import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <div className="flex flex-grow">
        {userInfo && <Navbar />}
        <ScrollToTop />
        <div className="flex-grow bg-[#F7F7F7]">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
