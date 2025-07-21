import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-List");
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator, backendUrl, getToken, SetisEducator } =
    useContext(AppContext);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        SetisEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const buttonClass =
    "text-xs sm:text-sm md:text-base bg-gradient-to-r from-[#64B5F6] via-[#1E88E5] to-[#0D47A1] text-white font-semibold px-3 py-2 rounded shadow-md hover:shadow-xl transition duration-300 cursor-pointer";

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-[#bbdefb]"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src="https://ik.imagekit.io/ytissbwn8/EduJet_logo.png?updatedAt=1743949036710"
        alt="logo-img"
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* Desktop buttons */}
      <div className="hidden md:flex items-center gap-4 text-white">
        {user && (
          <>
            <button onClick={becomeEducator} className={buttonClass}>
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>
            <Link to="/my-enrollments" className={buttonClass}>
              My Enrollments
            </Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()} className={buttonClass}>
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Buttons */}
      <div className="md:hidden flex items-center gap-2 text-[#0d47a1]">
        {user && (
          <>
            <button onClick={becomeEducator} className={buttonClass}>
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>
            <Link to="/my-enrollments" className={buttonClass}>
              My Enrollments
            </Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: "#0d4781" }}
              className="bg-white rounded-full p-1 border-[#0d4781] border-2 w-6 h-6"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
