import { useState } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/Logo.png";
import axios from "axios";
Buyservice.propTypes = {
  price: PropTypes.any,
  deliveryTime: PropTypes.any,
  serviceID: PropTypes.any,
  onClose: PropTypes.func,
};
export default function Buyservice({
  price,
  deliveryTime,
  serviceID,
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("userToken");

  function buyaservice() {
    axios
      .post(
        "https://skilly.runasp.net/api/Payment/start-payment-URL",
        {
          serviceID,
          redirectUrl: `${window.location.origin}/#/paymentsuccesspopup`,
,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          window.location.href = res.data.result.iframeUrl;
        }
      });
  }
  return (
    <div>
      {!isOpen && (
        <div className="bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-md my-5 z-10 absolute mx-auto p-5 max-w-md w-full ">
          <div className="bg-[#3B9DD2] text-white px-20 py-3 rounded-lg text-center">
            شراء الخدمة
          </div>
          <form className="max-w-md mx-auto mt-14" dir="rtl">
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="mb-5">
                <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  سعر الخدمة
                </label>
                <input
                  readOnly
                  value={price}
                  type="text"
                  className="bg-gray-200  text-sm rounded-lg block w-full p-2.5 text-[#3B9DD2] text-center font-bold"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  مدة التسليم
                </label>
                <input
                  value={deliveryTime}
                  type="text"
                  className="bg-gray-200  text-sm rounded-lg block w-full p-2.5 text-[#3B9DD2] text-center font-bold"
                />
              </div>
            </div>

            <div className="w-full text-center">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-white bg-[#3B9DD2] font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/2"
              >
                شراء
              </button>
            </div>
          </form>
        </div>
      )}
      {isOpen && (
        <div className="bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-md my-5 z-10 absolute mx-auto p-5 max-w-xs w-full">
          <img src={logo} className="w-[100px] mx-auto" />
          <p className="my-3 font-bold text-center">
            هل انت متأكد من شراء الخدمة؟
          </p>
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="bg-[#23255B] text-white px-4 py-2 rounded-lg"
            >
              رجوع
            </button>
            <button
              onClick={buyaservice}
              className="bg-[#3B9DD2] text-white px-4 py-2 rounded-lg"
            >
              شراء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
