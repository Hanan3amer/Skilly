import { useEffect, useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Offers from "../Offers/Offers";
import Slider from "react-slick";
import { TbEdit } from "react-icons/tb";
import OrderTracking from "./OrderTracking";
import { useChat } from "../../Context/ChatContext";
export default function ProfilePage() {
  const { chatCount } = useChat();
  const [offersCountMap, setOffersCountMap] = useState({});
  const token = localStorage.getItem("userToken");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState([]);
  const [request, setRequest] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  const openOfferModal = (id) => {
    setSelectedOfferId(id);
    setIsModalOpen(true);
  };
  const openTrackModal = (id) => {
    setSelectedOfferId(id);
    setIsTrackOpen(true);
  };

  function togglebtn() {
    setToggle(!toggle);
  }

  function getUser() {
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
        console.log(ApiResponse.data.user);
      })
      .catch((ApiResponse) => {
        console.log(ApiResponse);
      });
  }

  function getRequests() {
    axios
      .get(
        "https://skilly.runasp.net/api/UserProfile/requestServices/GetAllRequestsByuserId",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((apiResponse) => {
        const services = apiResponse.data.services;
        setRequest(services);
        console.log(apiResponse.data.services);
        services.forEach((service) => getofferCount(service.id));
      });
  }

  function getofferCount(id) {
    axios
      .get(`https://skilly.runasp.net/api/OfferSalary/GetOffersCountBy/${id}`)
      .then((res) => {
        setOffersCountMap((prev) => ({
          ...prev,
          [id]: res.data.offersCount,
        }));
      });
  }
  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    getUser();
    getRequests();
  }, [token]);

  return (
    <div
      className="container flex flex-col md:flex-row items-start justify-between gap-8 my-32"
      dir="rtl"
    >
      <div className="w-full md:w-1/4">
        <h1 className="font-bold text-xl text-[#27AAE1] my-3">الحساب الشخصي</h1>
        {user && (
          <div className="flex items-center gap-2">
            <img src={user.img} className="rounded-full w-20 h-20" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <p className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </p>
                <VscVerifiedFilled className="text-[#27AAE1] text-md" />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Link to={"/messages"}>
                    <IoChatbubbleEllipsesOutline className="text-3xl" />
                  </Link>
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#a4d7f5] border-2 border-white rounded-full -top-2 end-4">
                    {chatCount}
                  </div>
                </div>
                <TbEdit
                  className="text-3xl cursor-pointer"
                  onClick={() => navigate("/user", { state: { user } })}
                />
              </div>
            </div>
          </div>
        )}
        <Link to="/requestservice">
          <button className="bg-[#27AAE1] text-white w-full py-2.5 rounded-lg text-center my-5">
            طلب خدمه جديدة
          </button>
        </Link>
        <button
          onClick={togglebtn}
          className="text-white font-medium w-full bg-[#27AAE1] rounded-lg text-sm px-5 py-3 flex items-center text-center justify-between my-5"
          type="button"
        >
          البيانات الشخصيه
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          className={`${
            toggle ? "block" : "hidden"
          } z-10 divide-y divide-gray-100`}
        >
          {user && (
            <>
              <ul className="text-sm p-3 rounded-lg flex justify-between bg-gray-200 gap-3 my-5">
                <li className="text-[#27AAE1] font-semibold">رقم الهاتف</li>
                <li>{user.phoneNumber}</li>
              </ul>
              <ul className="text-sm p-3 rounded-lg flex justify-between bg-gray-200 gap-3 my-5">
                <li className="text-[#27AAE1] font-semibold">البريد</li>
                <li>{user.email}</li>
              </ul>
              <ul className="text-sm p-3 rounded-lg flex justify-between bg-gray-200 gap-3 my-5">
                <li className="text-[#27AAE1] font-semibold">اسم الشارع</li>
                <li>{user.streetName}</li>
              </ul>
              <ul className="text-sm p-3 rounded-lg flex justify-between bg-gray-200 gap-3 my-5">
                <li className="text-[#27AAE1] font-semibold">المدينه</li>
                <li>{user.city}</li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="w-full md:w-3/4">
        <button className="bg-[#27AAE1] text-white py-2 px-10 font-bold rounded-lg mb-6">
          طلباتي
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {request?.map((service) => (
            <div key={service.id} className="bg-gray-100 rounded-lg p-4">
              <Link to={`/orderdetail/${service.id}`}>
                <Slider {...settings}>
                  {service.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.img}
                      alt="Service"
                      className="w-full h-60 object-cover rounded-lg"
                    />
                  ))}
                </Slider>
                <h3 className="text-md font-bold mt-3 text-[#040404]">
                  {service.name}
                </h3>
                <p className="text-[#23255B] text-sm mt-2">{service.notes}</p>
              </Link>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => openOfferModal(service.id)}
                  className="flex items-center gap-3 my-3 z-30"
                >
                  <span className="text-[#23255B] font-bold rounded-full text-sm z-50">
                    العروض
                  </span>
                  <span className="rounded-full bg-[#23255B] text-white px-2">
                    {offersCountMap[service.id] ?? 0}
                  </span>
                </button>
                <button
                  onClick={() => openTrackModal(service.id)}
                  className=" mx-auto text-center border-2 my-5 px-3 py-2 rounded-md 
                    
                      border-[#27AAE1] text-[#27AAE1] hover:border-[#9bc2d492] hover:text-white"
                >
                  متابعة الطلب
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="flex items-center gap-2 text-gray-700 font-semibold">
            <span>عرض المزيد</span>
            <span>&larr;</span>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000051] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full md:w-1/3 rounded-lg  p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-5 text-gray-500 text-xl"
            >
              &times;
            </button>
            <Offers requestId={selectedOfferId} />
          </div>
        </div>
      )}
      {isTrackOpen && (
        <div className="fixed inset-0 bg-[#00000051] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full md:w-1/4 mx-auto py-3 px-8 relative max-h-[90vh] overflow-y-auto">
            <OrderTracking requestId={selectedOfferId} />
            <button
              onClick={() => setIsTrackOpen(false)}
              className="absolute bottom-2 right-1/2 text-white font-bold rounded-lg px-5 py-2 text-sm bg-[#27AAE1]"
            >
              غلق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
