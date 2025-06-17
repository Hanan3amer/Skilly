import axios from "axios";
import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { PiChatCircleDots } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Winner from "../winner/Winner";

export default function PaymentSuccessPopup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [providerId, setProviderId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const token = localStorage.getItem("userToken");
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success");
    const order = queryParams.get("order");

    if (success === "true" && order) {
      setOrderId(order);
      axios
        .post(
          `https://skilly.runasp.net/api/Payment/payment-URl-callback/${order}`,
          {
            success: success === "true",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          const data = res?.data;
          if (data?.success === true) {
            setIsVerified(true);
            setProviderId(data.providerId);
            setChatId(data.chatId);
            setShowSuccessPopup(true);
          } else {
            navigate("/");
          }
        })
        .catch((res) => {
          console.log(res);
          navigate("/");
        });
    } else {
      navigate("/payment-error");
    }
  }, [location, navigate]);

  if (!isVerified) {
    return (
      <div className="text-center text-gray-500 mt-10">
        جاري التحقق من الدفع...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="border border-gray-200 max-w-md p-5 rounded-lg mx-auto shadow-sm">
        <FaCircleCheck className="text-green-600 text-5xl mx-auto text-center" />
        <h2 className="text-gray-500 font-bold text-center my-3">
          ! تم الدفع بنجاح
        </h2>
        <p className="text-md text-center font-semibold text-gray-500 mt-2">
          لأي استفسارات أو لمشاركة تفاصيل إضافية، تقدر تتواصل مع موفر الخدمة من
          خلال الشات
        </p>
        <Link to={`/messages/${chatId}?userId=${providerId}`}>
          <PiChatCircleDots className="text-[#27AAE1] text-4xl mx-auto my-3" />
        </Link>
        <Link to="/">
          <button className="flex mx-auto text-center bg-green-600 rounded-lg px-5 text-white py-1.5">
            حسنا
          </button>
        </Link>
      </div>
      {showSuccessPopup && (
        <Winner onClose={() => setShowSuccessPopup(false)} />
      )}
    </div>
  );
}
