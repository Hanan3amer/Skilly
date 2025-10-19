import axios from "axios";
import cup from "../../assets/cup.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { UserDataContext } from "../../Context/UserDataContext";
import { Link } from "react-router-dom";
import Buyservice from "../Buyservice/Buyservice";
export default function Rewards() {
  const [discounts, setDiscounts] = useState([]);
  const [error, setError] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const { user } = useContext(UserDataContext);
  const token = localStorage.getItem("userToken");

  function getDiscountServices() {
    axios
      .get(
        "https://skilly.runasp.net/api/Provider/ProviderServices/get-all-DiscountServices",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((apiResponse) => {
        setDiscounts(apiResponse.data.services);
      });
  }

  function discountUseage(service) {
    setIsApplyingDiscount(true);
    axios
      .post(
        `https://skilly.runasp.net/api/Provider/ProviderServices/apply-Discount/${service.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSelectedService(service);
          setShowBuyPopup(true);
        }
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setError("ليس لديك نقاط كافية لاستخدام الخصم");
        }
      })
      .finally(() => {
        setIsApplyingDiscount(false);
      });
  }

  useEffect(() => {
    getDiscountServices();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <>
      <div className="container my-10">
        <div
          className="border border-gray-300 max-w-5xl mx-auto rounded-xl p-5"
          dir="rtl"
        >
          <h1 className="text-2xl font-bold text-[#27AAE1]">
            اهلا {user?.firstName} {user?.lastName}
          </h1>
          <div className="border border-gray-300 mx-auto max-w-xl p-4 rounded-xl bg-[#F8F9FF] my-5">
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div>
                <h2 className="font-bold text-black text-3xl">
                  النقاط الحالية
                </h2>
                <h3 className="font-bold text-[#FBBC05] text-3xl">
                  {user?.points > 0 ? user?.points : 0}
                </h3>
                <p className="text-black text-sm">معاك 100 نقطة؟ !</p>
                <p className="text-black text-sm">
                  استبدلهم دلوقتي واحصل علي خصم 15%من الخدمة
                </p>
              </div>
              <img src={cup} alt="cup" className="w-[200px]" />
            </div>
          </div>
          {error ? (
            <div
              className="p-4 mb-4 text-sm text-center text-red-800 rounded-lg bg-red-50 "
              role="alert"
            >
              {error}
            </div>
          ) : (
            ""
          )}
          <div className="flex items-center justify-between my-3">
            <h2 className="text-black font-bold text-md">اشتري الان</h2>
            <div className="flex items-center justify-center text-center">
              <p className="text-black font-bold text-sm ml-2">عرض المزيد</p>
              <FaArrowLeftLong className="text-black font-bold text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {discounts.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">
                لا توجد خصومات متاحة حالياً.
              </p>
            ) : (
              discounts.map((service) => (
                <div key={service.id} className="flex flex-col">
                  <div className="border border-gray-300 rounded-xl flex flex-col gap-2">
                    <Link
                      to={`/discountdetail/${service.id}`}
                      state={{ service }}
                    >
                      <Slider {...settings}>
                        {service.images.map((img, index) => (
                          <img
                            key={index}
                            src={img.img}
                            alt="service"
                            className="rounded-t-xl object-cover h-40 w-full"
                          />
                        ))}
                      </Slider>
                      <div className="flex items-center justify-around my-5">
                        <p className="text-xs font-bold">{service.name}</p>
                        <div className="flex flex-col items-center justify-center">
                          <del className="text-xs font-bold text-[#6C757D]">
                            {service.price} ج.م
                          </del>
                          <span className="text-xs font-bold text-[#27AAE1]">
                            {service.priceDiscount} ج.م
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <button
                    onClick={() => discountUseage(service)}
                    disabled={isApplyingDiscount}
                    className={`mt-2 mx-auto text-center border-2 my-5 px-3 py-2 rounded-md 
                      ${
                        isApplyingDiscount
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#9bc2d492]"
                      } 
                      border-[#27AAE1] text-[#27AAE1] hover:border-[#9bc2d492] hover:text-white`}
                  >
                    {isApplyingDiscount ? "جاري التفعيل..." : "استخدم الخصم"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showBuyPopup && selectedService && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000038] bg-opacity-50 z-50 flex justify-center items-center">
          <Buyservice
            price={selectedService.priceDiscount}
            deliveryTime={selectedService.deliverytime}
            serviceID={selectedService.id}
            onClose={() => setShowBuyPopup(false)}
          />
        </div>
      )}
    </>
  );
}
