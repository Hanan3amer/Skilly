import axios from "axios";
import cup from "../../assets/cup.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { UserDataContext } from "../../Context/UserDataContext";
import { Link } from "react-router-dom";
export default function Rewards() {
  const [discounts, setDiscounts] = useState([]);
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

  function discountUseage(serviceId) {
    axios
      .post(
        `https://skilly.runasp.net/api/Provider/ProviderServices/apply-Discount/${serviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((apiResponse) => {
        console.log(apiResponse);
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
        <div className="border max-w-5xl mx-auto rounded-xl p-5" dir="rtl">
          <h1 className="text-2xl font-bold text-[#27AAE1]">
            اهلا {user?.firstName} {user?.lastName}
          </h1>
          <div className="border mx-auto max-w-xl p-4 rounded-xl bg-[#F8F9FF] my-5">
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div>
                <h2 className="font-bold text-black text-3xl">
                  النقاط الحالية
                </h2>
                <h3 className="font-bold text-[#FBBC05] text-3xl">
                  {user?.points}
                </h3>
                <p className="text-black text-sm">معاك 100 نقطة؟ !</p>
                <p className="text-black text-sm">
                  استبدلهم دلوقتي واحصل علي خصم 15%من الخدمة
                </p>
              </div>
              <img src={cup} alt="cup" className="w-[200px]" />
            </div>
          </div>
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
                  <div className="border rounded-xl flex flex-col gap-2">
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
                    onClick={() => discountUseage(service.id)}
                    className="mt-2 mx-auto text-center border-2 my-5 px-3 py-2 rounded-md border-[#27AAE1] text-[#27AAE1] hover:bg-[#9bc2d492] hover:border-[#9bc2d492] hover:text-white"
                  >
                    استخدم الخصم
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
