import { useState, useEffect, useContext } from "react";
import Logo from "../../assets/Logo.png";
import navb from "../../assets/navb.svg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";
import { ProviderContext } from "../../Context/ProviderContext";
import axios from "axios";
import { RiAlarmWarningFill } from "react-icons/ri";
import defaultUserImg from "../../assets/userpic.jpg";
import { getUserType } from "../../utils/hooks/getUserType";
import NotificationsModal from "../Notifiction/NotificationModal";
export default function Navbar() {
  const token = localStorage.getItem("userToken");
  const userType = getUserType();
  const { userLogin, setUserLogin } = useContext(AuthContext);
  const { providerData, getProviderData } = useContext(ProviderContext);
  const [toggle, setToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (userLogin) {
      getNotificationsCount();
    }
  }, [userLogin]);

  const getNotificationsCount = () => {
    axios
      .get("https://skilly.runasp.net/api/Notification/GetUserNotifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotificationsCount(res.data.notifications?.length || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications count:", err);
      });
  };

  function getUser() {
    if (!token) return;

    axios
      .get(
        `https://skilly.runasp.net/api/UserProfile/UserProfile/GetUserProfileByuserId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((ApiResponse) => {
        setUser(ApiResponse.data.user);
      })
      .catch((ApiResponse) => {
        console.log("Error fetching user data:", ApiResponse);
      });
  }

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function handleToggle() {
    setToggle(!toggle);
  }

  const navigate = useNavigate();

  useEffect(() => {
    // console.log(
    //   // "Navbar: Auth state changed - UserLogin:",
    //   !!userLogin,
    //   // "UserType:",
    //   userType
    // );

    if (userLogin) {
      if (+userType === 0) {
        getUser();
      } else if (+userType === 1) {
        getProviderData();
      }
    }
  }, [userLogin, userType]);

  function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    localStorage.removeItem("providerData");

    localStorage.setItem("lastLogout", Date.now().toString());

    setUserLogin(null);
    setUser([]);

    navigate("/");

    window.location.reload();
  }

  // useEffect(() => {
  //   if (userLogin) {
  //     console.log("User type:", userType);
  //     console.log("User data:", user);
  //     console.log("Provider data:", providerData);
  //   }
  // }, [userLogin, userType, user, providerData]);

  const profileData = +userType === 1 ? providerData : user;

  const profileImage = (() => {
    let imgUrl;
    if (profileData) {
      if (typeof profileData.img === "string") {
        imgUrl = profileData.img;
      } else if (profileData.img && typeof profileData.img === "object") {
        imgUrl =
          profileData.img.url ||
          profileData.img.src ||
          profileData.img.path ||
          JSON.stringify(profileData.img);
      }
      // console.log(
      //   `Using ${userType === "1" ? "provider" : "user"} image:`,
      //   imgUrl
      // );
    }

    if (
      imgUrl &&
      typeof imgUrl === "string" &&
      imgUrl.indexOf("/") === 0 &&
      imgUrl.indexOf("//") !== 0
    ) {
      imgUrl = `https://skilly.runasp.net${imgUrl}`;
    }

    if (!imgUrl) {
      imgUrl = defaultUserImg;
    }

    // console.log("Final image URL:", imgUrl);
    return imgUrl;
  })();

  return (
    <>
      <nav className="bg-white w-full sticky top-0  z-[49] ">
        <div className="mx-auto sm:px-0 md:px-3">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                onClick={handleToggle}
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:ring-2 focus:ring-white focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={toggle}
              >
                <span className="sr-only">Open main menu</span>
                <img src={navb} className="w-10 h-7" alt="Menu Icon" />
              </button>
            </div>
            <div className="flex  items-center justify-around flex-1 ">
              <Link
                to={userLogin && userType === "1" ? "/serviceprovider" : "/"}
              >
                <div className="flex shrink-0 items-center justify-center ">
                  <img
                    src={Logo}
                    className="h-16 hover:scale-110
              transition-all px-14"
                    alt="Skilly Logo"
                  />
                </div>
              </Link>
              <div className="hidden sm:block mx-auto">
                <ul className="flex md:space-x-4 space-x-0 mx-auto text-center items-center justify-center md:text-lg text-xs font-semibold">
                  <li>
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      to={"/contactus"}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#3B9DD2]"
                          : "block py-2 px-3 text-gray-600 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#3B9DD2] md:p-0  "
                      }
                    >
                      تواصل معنا
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      to={
                        userLogin && userType === "1" ? "/serviceprovider" : "/"
                      }
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#3B9DD2]"
                          : "block py-2 px-3 text-gray-600 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#3B9DD2] md:p-0  "
                      }
                    >
                      الرئيسية
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      to={"/aboutus"}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#3B9DD2]"
                          : "block py-2 px-3 text-gray-600 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#3B9DD2] md:p-0  "
                      }
                    >
                      من نحن
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      to={"/ourservices"}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#3B9DD2]"
                          : "block py-2 px-3 text-gray-600 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#3B9DD2] md:p-0  "
                      }
                    >
                      خدماتنا
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className={`${userLogin ? "hidden" : "flex"} gap-2`}>
                <Link
                  to={"/signin"}
                  type="button"
                  className="text-xs md:text-xs flex items-center text-center  justify-center font-medium text-[#3B9DD2] focus:outline-none rounded-lg  hover:text-[#7cc3e9] "
                >
                  تسجيل دخول
                </Link>
                <Link
                  to={"/accounttype"}
                  type="button"
                  className=" border rounded-xl p-2  text-xs md:text-xs flex items-center text-center  justify-center font-medium text-[#3B9DD2] focus:outline-none \  hover:text-white hover:bg-[#74bfe8b1]"
                >
                  سجل الان
                </Link>
              </div>
              <Link to="/emergency">
                {userLogin && userType === "0" && (
                  <button className="text-white bg-red-600 font-bold px-5 py-1.5 rounded-xl me-3 flex items-center gap-1 hover:bg-red-300">
                    <RiAlarmWarningFill className="w-5 h-5" /> الطوارئ
                  </button>
                )}
              </Link>

              {userLogin && (
                <>
                  <button
                    onClick={openModal}
                    type="button"
                    className="relative inline-flex items-center  text-sm font-medium text-center  border border-[#3B9DD2] rounded-full p-2 hover:bg-gray-200"
                  >
                    <IoMdNotificationsOutline className="h-5 w-5 text-[#3B9DD2]" />
                    {notificationsCount > 0 && (
                      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#a4d7f5] border-2 border-white rounded-full -top-2 -end-2">
                        {notificationsCount}
                      </div>
                    )}
                  </button>
                  <NotificationsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCountChange={setNotificationsCount}
                  />
                </>
              )}
              {userLogin && (
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={toggleMenu}
                      type="button"
                      className="relative flex rounded-full bg-gray-800 text-sm focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-hidden"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>

                      <img
                        className="size-9 rounded-full object-cover"
                        src={profileImage}
                        alt="User Profile"
                        // onError={(e) => {
                        //   console.log("Image failed to load:", e.target.src);
                        //   e.target.onerror = null;
                        //   e.target.src = defaultUserImg;
                        // }}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      className="absolute right-0 mt-2 w-[300px] origin-top-right rounded-md bg-white px-5 ring-1 shadow-lg ring-black/5"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <Link
                        to={userType === "1" ? "/mainprofile" : "/userprofile"}
                        onClick={() => setIsOpen(false)}
                      >
                        <ul className="text-sm p-3 rounded-lg text-right bg-gray-200 gap-3 my-5">
                          <li className="text-gray-600 font-semibold">
                            حسابك الشخصي
                          </li>
                        </ul>
                      </Link>
                      <Link to="/praivcy" onClick={() => setIsOpen(false)}>
                        <ul className=" text-sm p-3 rounded-lg text-right  bg-gray-200 gap-3 my-5">
                          <li className="text-gray-600 font-semibold">
                            سياسه الخصوصيه
                          </li>
                        </ul>
                      </Link>
                      <Link to="/terms" onClick={() => setIsOpen(false)}>
                        <ul className=" text-sm p-3 rounded-lg text-right  bg-gray-200 gap-3 my-5">
                          <li className="text-gray-600 font-semibold">
                            {" "}
                            الشروط والاحكام
                          </li>
                        </ul>
                      </Link>
                      <Link
                        to="/forgotpassword"
                        onClick={() => setIsOpen(false)}
                      >
                        <ul className=" text-sm p-3 rounded-lg text-right bg-gray-200 gap-3 my-5">
                          <li className="text-gray-600 font-semibold">
                            نغيير كلمة المرور
                          </li>
                        </ul>
                      </Link>
                      <Link to="/contactus" onClick={() => setIsOpen(false)}>
                        <ul className=" text-sm p-3 rounded-lg text-right bg-gray-200 gap-3 my-5">
                          <li className="text-gray-600 font-semibold">
                            تواصل معنا
                          </li>
                        </ul>
                      </Link>
                      <ul
                        className=" text-sm p-3 rounded-lg text-right bg-red-100 gap-3 my-5"
                        onClick={() => setIsOpen(false)}
                      >
                        <li
                          onClick={logout}
                          className="text-red-500 font-semibold cursor-pointer"
                        >
                          تسجيل الخروج
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {toggle && (
            <div className="absolute top-16 left-0 w-full bg-white shadow-md  sm:hidden">
              <ul className="flex flex-col space-y-2 p-4">
                <li>
                  <NavLink
                    to="/contactus"
                    className="block py-2 px-3 text-gray-600 "
                  >
                    تواصل معنا
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={
                      userLogin && userType === "1" ? "/serviceprovider" : "/"
                    }
                    className="block py-2 px-3 text-[#3B9DD2]"
                  >
                    الرئيسية
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/aboutus"
                    className="block py-2 px-3 text-gray-600 "
                  >
                    من نحن
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ourservices"
                    className="block py-2 px-3 text-gray-600 "
                  >
                    خدماتنا
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
