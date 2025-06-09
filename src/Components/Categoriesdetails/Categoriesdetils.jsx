import { useEffect, useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { FaStar } from "react-icons/fa6";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import navb from "../../assets/navb.svg";
import nodata from "../../assets/nodata.svg";
export default function Categoriesdetils() {
  const { id } = useParams();
  const [toggle, setToggle] = useState(false);
  const [catdetails, setCatDetails] = useState([]);
  const [activeOption, setActiveOption] = useState("serviceproviders");
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [sortBy, setSortBy] = useState("nearest");

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  function handleOptionChange(option) {
    setActiveOption(option);
  }

  function getCategoryDeatails(id) {
    axios
      .get(`https://skilly.runasp.net/api/Category/GetCategoryBy/${id}`)
      .then((res) => {
        setCatDetails(res.data.category);
      });
  }

  function getProviders(catid) {
    axios
      .get(
        `https://skilly.runasp.net/api/Provider/GetAllServiceProvidersBy/${catid}`
      )
      .then((res) => {
        setProviders(res.data.provider);
      });
  }

  function getServiceby(categoryId, sortBy) {
    const token = localStorage.getItem("userToken");

    axios
      .get(
        `https://skilly.runasp.net/api/Provider/ProviderServices/GetAllServicesBy/${categoryId}?sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setServices(res.data.service);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
      });
  }

  useEffect(() => {
    getCategoryDeatails(id);
    getProviders(id);
    getServiceby(id, sortBy);
  }, [id, sortBy]);

  return (
    <div className="container">
      <h1 className="text-[#27AAE1] font-bold text-2xl my-5 text-center">
        {catdetails ? catdetails.name : ""}
      </h1>

      <div className="border max-w-xl mx-auto p-5 rounded-lg">
        <div className="flex justify-around items-center gap-3">
          <div
            onClick={() => handleOptionChange("Servicesoffered")}
            className={`cursor-pointer text-sm font-medium text-center px-10 py-5 me-2 mb-2 rounded-lg w-full ${
              activeOption === "Servicesoffered"
                ? "text-white bg-[#23255B]"
                : "bg-[#D9D9D95C]"
            }`}
          >
            الخدمات المعروضه
          </div>
          <div
            onClick={() => handleOptionChange("serviceproviders")}
            className={`cursor-pointer text-sm font-medium px-10 py-5 text-center me-2 mb-2 rounded-lg w-full ${
              activeOption === "serviceproviders"
                ? "text-white bg-[#23255B]"
                : "bg-[#D9D9D95C]"
            }`}
          >
            موفري الخدمة
          </div>
        </div>

        {activeOption === "serviceproviders" ? (
          providers?.length > 0 ? (
            providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-gray-100 p-4 text-center rounded-md my-5"
              >
                <Link to={`/providerprofileuser/${provider.id}`}>
                  <div className="flex gap-5 items-center" dir="rtl">
                    <img
                      className="w-14 h-14 rounded-full"
                      src={provider.img}
                      alt="user"
                    />
                    <div className="flex gap-1 flex-col">
                      <div className="flex items-center gap-1">
                        <h5 className="font-bold">
                          {`${provider.firstName} ${provider.lastName}`}
                        </h5>
                        <VscVerifiedFilled className="text-[#27AAE1] text-xl" />
                      </div>
                      <div className="flex gap-1">
                        <span className="bg-[#FBBC05] rounded-full w-5 h-5 p-3 relative">
                          <FaStar className="text-[#23255B] absolute text-center translate-x-1/2 -translate-y-1/2" />
                        </span>
                        <span>{provider.review}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div>
              <p className="text-center text-sm text-gray-500 my-5">
                لا يوجد موفرو خدمة حاليًا.
              </p>
              <img src={nodata} />
            </div>
          )
        ) : (
          <div className="my-5 p-2 rounded-md items-center" dir="rtl">
            <div className="relative flex justify-end">
              <button
                onClick={() => setToggle(!toggle)}
                className="flex items-center rounded-md p-2 text-gray-400 "
                aria-expanded={toggle}
                aria-label="Open main menu"
              >
                <img src={navb} className="w-5 h-5" alt="Menu Icon" />
                ترتيب حسب
              </button>
              {toggle && (
                <div className="absolute z-30 mt-2 border border-gray-300 w-64 origin-top-left left-0 top-8 rounded-md bg-white">
                  <div
                    className="text-right p-2 bg-[#27a9e126] border-b font-semibold text-gray-600 cursor-pointer"
                    onClick={() => {
                      setSortBy("nearest");
                      setToggle(false);
                    }}
                  >
                    الاقرب لموقعك
                  </div>

                  <div
                    className="text-right p-2 border-b font-semibold text-gray-600 cursor-pointer"
                    onClick={() => {
                      setSortBy("price-asc");
                      setToggle(false);
                    }}
                  >
                    من الاقل سعر الي اعلي
                  </div>

                  <div
                    className="text-right p-2 font-semibold text-gray-600 cursor-pointer"
                    onClick={() => {
                      setSortBy("latest");
                      setToggle(false);
                    }}
                  >
                    من الاحدث الي الاقدم
                  </div>
                </div>
              )}
            </div>

            {services?.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-100 rounded-md p-3 mb-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center" dir="rtl">
                      <img
                        className="w-14 h-14 rounded-full"
                        src={service.providerImg}
                        alt="user photo"
                      />
                      <div className="flex p-2 gap-1 flex-col">
                        <div className="flex items-center gap-1">
                          <h5 className="font-bold text-sm">
                            {service.serviceProviderName}
                          </h5>
                          <VscVerifiedFilled className="text-[#27AAE1] text-xl" />
                        </div>
                        <div className="flex gap-1">
                          <span className="bg-[#FBBC05] rounded-full w-2 h-2 p-3 relative">
                            <FaStar className="text-[#23255B] absolute text-center translate-x-1/2 -translate-y-1/2" />
                          </span>
                          {/* <span>{review}</span> */}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs">
                      {service.serviceRequestTime.split("T")[0]}
                    </div>
                  </div>

                  <Slider {...settings} className="my-10">
                    {service.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.img}
                        className="mx-auto rounded-lg h-[200px] w-[90%]"
                      />
                    ))}
                  </Slider>

                  <h5 className="text-[#27AAE1] font-bold text-xs">
                    {service.title}
                  </h5>
                  <p className="text-sm my-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <Link to={`servicedetail/${service.id}`}>
                      <button className="text-sm bg-[#27AAE1] text-white px-5 text-center py-1 rounded-lg">
                        عرض تفاصيل
                      </button>
                    </Link>
                    <span className="text-sm text-[#27AAE1] font-bold">
                      {service.price} ج.م
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p className="text-center text-sm text-gray-500 my-5">
                  لا توجد خدمات معروضة حاليًا.
                </p>
                <img src={nodata} />
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="bg-gray-100 p-2 rounded-md max-w-xl mx-auto my-10"
        dir="rtl"
      >
        <h5 className="font-bold py-2 text-sm">ملحوظة:</h5>
        <p className="text-[10px] font-semibold">
          إذا كنت بحاجة إلى تصميم خاص أو خدمة غير مذكورة هنا، يمكنك تقديم طلب
          خدمة مخصص وسنلبي احتياجاتك بكل احترافية.
        </p>
      </div>
    </div>
  );
}
