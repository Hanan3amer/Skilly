import { useEffect, useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BsChatDots } from "react-icons/bs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Offers from "../Offers/Offers";
import Slider from "react-slick";

export default function ProfilePage() {
  const [offersCountMap, setOffersCountMap] = useState({});
  const token = localStorage.getItem("userToken");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState([]);
  const [request, setRequest] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const navigate = useNavigate()
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
                <p className="text-xs font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <VscVerifiedFilled className="text-[#27AAE1] text-md" />
              </div>
              <Link to={"/messages"}>
                <BsChatDots />
              </Link>
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
              <button
                onClick={() => openOfferModal(service.id)}
                className="flex items-center gap-5 my-3 z-30"
              >
                <span className="text-[#23255B] font-bold rounded-full text-sm z-50">
                  العروض
                </span>
                <span className="rounded-full bg-[#23255B] text-white px-2">
                  {offersCountMap[service.id] ?? 0}
                </span>
              </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[35%] p-6 relative">
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
    </div>
  );
}
