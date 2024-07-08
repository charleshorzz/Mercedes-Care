import React, { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { SiMercedes } from "react-icons/si";
import { FaEnvelope } from "react-icons/fa6";
import { RiAddBoxLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { IoHome } from "react-icons/io5";
import { IoIosCalendar, IoMdSettings } from "react-icons/io";
import { IoMdWallet } from "react-icons/io";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa";
import adminLogOut from "../assets/adminLogOut.png";

const Navbar = () => {
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    if (userInfo) {
      setOpen(userInfo.isAdmin || userInfo.isMechanic);
    }

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [userInfo]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };

  const active = {
    backgroundColor: "rgba(0, 161, 155, 0.35)",
  };

  const nonAdminMenus = [
    { name: "Home", link: "/userHomePage", icon: IoHome },
    { name: "Notifications", link: "/notifications", icon: FaEnvelope },
    {
      name: "Book Appointment",
      link: "/booking",
      icon: RiAddBoxLine,
    },
    { name: "Maintenance List", link: "/list", icon: FaClipboardList },
    { name: "Settings", link: "/settings", icon: IoMdSettings },
    {
      name: "Logout",
      icon: BiLogOut,
      logOutFunction: true,
      margin: true,
    },
  ];

  const adminMenus = [
    { name: "Appointments", link: "/adminHomePage", icon: FaClipboardList },
    { name: "Payment", link: "/adminPaymentPage", icon: IoMdWallet },
    {
      name: "Feedback",
      link: "/adminFeedbackPage",
      icon: BiSolidMessageDetail,
    },
    { name: "Settings", link: "/adminSettingsPage", icon: IoMdSettings },
    {
      name: "Log Out",
      icon: adminLogOut,
      logOutFunction: true,
      margin: true,
      isAdmin: true,
    },
  ];

  const mechanicMenus = [
    { name: "Appointments", link: "/mechanicHomePage", icon: FaClipboardList },
    {
      name: "Log Out",
      icon: adminLogOut,
      logOutFunction: true,
      margin: true,
      isAdmin: true,
    },
  ];

  const renderMenus = (menus) => (
    <div className="mt-24 flex flex-col gap-4 relative justify-center">
      {menus?.map((menu, i) => (
        <NavLink
          to={menu?.link}
          key={i}
          onClick={() => menu.logOutFunction && logoutHandler()}
          className={`${
            menu?.margin && "mt-32"
          } group flex items-center text-lg gap-5 font-medium p-2 hover:bg-[#00A19B] hover:bg-opacity-35 rounded-md`}
          activeclassname="active"
          style={location.pathname === menu.link ? active : {}}
        >
          {menu.isAdmin ? (
            <img
              src={menu.icon}
              alt="Logout"
              style={{ width: "23px", height: "23px" }}
            />
          ) : (
            <div>{React.createElement(menu?.icon, { size: "23" })}</div>
          )}
          <h2
            style={{
              transitionDelay: `${i + 3}00ms`,
            }}
            className={`whitespace-pre duration-500 z-20 ${
              !open && "opacity-0 translate-x-28 overflow-hidden"
            }`}
          >
            {menu?.name}
          </h2>
          <h2
            className={`${
              open && "hidden"
            } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
          >
            {menu?.name}
          </h2>
        </NavLink>
      ))}
    </div>
  );

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="flex gap-6 relative z-20">
      <div
        className={`bg-[white] min-h-screen ${
          open ? "w-72" : "w-20"
        } duration-500 text-black px-[1.25rem]`}
      >
        <div className="py-1 mt-12 flex justify-center items-center space-x-10">
          <NavLink
            to={
              userInfo?.isAdmin
                ? "/adminHomePage"
                : userInfo?.isMechanic
                ? "/mechanicHomePage"
                : "/userHomePage"
            }
          >
            <SiMercedes size={`${userInfo.isAdmin ? "50" : "30"}`} />
          </NavLink>
          {(userInfo.isAdmin || userInfo.isMechanic) && (
            <div className="text-center">
              <div className="text-lg font-semibold">
                {formatTime(dateTime)}
              </div>
              <div className="text-sm text-gray-500">
                {dateTime.toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
        <div className="">
          {(userInfo?.isAdmin || userInfo?.isMechanic) && (
            <div className="mt-6 items-start">
              <div className="text-center text-sm text-gray-500">
                Service Center
              </div>
              <div className="text-center text-lg text-black font-semibold mt-1">
                {userInfo.location}
              </div>
            </div>
          )}
          {userInfo?.isMechanic && (
            <div className="mt-6 items-start">
              <div className="text-center text-sm text-gray-500">Mechanic</div>
              <div className="text-center text-lg text-black font-semibold mt-1">
                {userInfo.name}
              </div>
            </div>
          )}
        </div>

        {userInfo && userInfo.isAdmin
          ? renderMenus(adminMenus)
          : userInfo?.isMechanic
          ? renderMenus(mechanicMenus)
          : renderMenus(nonAdminMenus)}
      </div>
    </section>
  );
};

export default Navbar;
