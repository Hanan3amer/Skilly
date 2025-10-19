import { useEffect, useState } from "react";
import axios from "axios";
import { BsBagCheckFill } from "react-icons/bs";
import { ImSpinner } from "react-icons/im";
import { FaBox } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
export default function OrderTracking({ requestId }) {
  const [trackingData, setTrackingData] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (requestId) {
      axios
        .get(
          `https://skilly.runasp.net/api/UserProfile/requestServices/track-request-service/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setTrackingData(response.data.result);
          console.log("Tracking Data:", response.data.result);
        })
        .catch((error) => {
          console.error("Error loading tracking data:", error);
        });
    }
  }, [requestId, token]);

  if (!trackingData) {
    return <p className="text-center">جاري تحميل بيانات التتبع...</p>;
  }

  let currentStep = trackingData.status;

  if (trackingData.statusArabic === "تم الدفع" || trackingData.status === 2) {
    currentStep = 1;
  }

  const steps = [
    {
      id: 0,
      icon: <BsBagCheckFill className="text-[#27AAE1] text-5xl" />,
      title: "تم تقديم الطلب",
      desc: "تم استلام طلبك بنجاح جاري التأكيد علي تفاصيله.",
    },
    {
      id: 1,
      icon: <ImSpinner className="text-[#27AAE1] text-5xl" />,
      title: "الطلب قيد التنفيذ",
      desc: "موفر الخدمة بدأ بتنفيذ طلبك جاري تجهيز الطلب بكل اهتمام",
    },
    {
      id: 2,
      icon: <FaBox className="text-[#27AAE1] text-5xl" />,
      title: "تم تنفيذ الطلب",
      desc: "تم الانتهاء من تجهيز الطلب الطلب جاهز للشحن أو التسليم",
    },
    {
      id: 3,
      icon: <FaTruck className="text-[#27AAE1] text-5xl" />,
      title: "تم استلام الطلب",
      desc: "العميل استلم الأوردر بنجاح نتمنى لك تجربة مميزة معنا!",
    },
  ];

  return (
    <div className="container">
      <div className="bg-[#27AAE1] text-white p-3 md:p-5 text-center rounded-xl font-bold text-lg sm:text-xl md:text-2xl my-4">
        متابعة الطلب
      </div>
      <ol className="relative border-s border-gray-200 ">
        {steps.map((step) => (
          <li key={step.id} className="mb-10 ms-4 relative">
            <div
              className={`absolute -start-[33px] top-2 w-9 h-9 rounded-full border border-gray-300  flex items-center justify-center ${
                step.id <= currentStep
                  ? "bg-[#27AAE1] text-white font-bold"
                  : "bg-white text-gray-400 "
              }`}
            >
              <span className="text-sm">
                {" "}
                {step.id <= currentStep ? <FaCheck /> : `${step.id + 1}`}
              </span>
            </div>
            <div className="flex items-start gap-5 ms-3">
              <div className="mt-1">{step.icon}</div>
              <div className="mt-1">
                <h3
                  className={`text-md font-bold text-center ${
                    step.id <= currentStep ? "text-[#27AAE1]" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500  mt-1 text-center">
                  {step.desc}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
