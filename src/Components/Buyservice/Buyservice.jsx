// import { useState } from "react";
// import PropTypes from "prop-types";
// import logo from "../../assets/Logo.png";
// import axios from "axios";
// Buyservice.propTypes = {
//   price: PropTypes.any,
//   deliveryTime: PropTypes.any,
//   serviceID: PropTypes.any,
// };
// export default function Buyservice({ price, deliveryTime, serviceID }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const token = localStorage.getItem("userToken");

//   function buyaservice() {
//     axios
//       .post(
//         "https://skilly.runasp.net/api/Payment/start-payment",
//         { serviceID, redirectUrl: "https://skilly-tau.vercel.app/" },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       .then((res) => {
//         console.log(res);
//         if (res.status === 200) {
//           window.location.href = res.data.result.iframeUrl;
//         }
//       });
//   }
//   return (
//     <div>
//       {!isOpen && (
//         <div className="bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-md my-5 z-10 absolute mx-auto p-5 max-w-md w-full ">
//           <div className="bg-[#3B9DD2] text-white px-20 py-3 rounded-lg text-center">
//             شراء الخدمة
//           </div>
//           <form className="max-w-md mx-auto mt-14" dir="rtl">
//             <div className="grid md:grid-cols-2 md:gap-6">
//               <div className="mb-5">
//                 <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
//                   سعر الخدمة
//                 </label>
//                 <input
//                   value={`${price} ج.م`}
//                   type="text"
//                   className="bg-gray-200  text-sm rounded-lg block w-full p-2.5 text-[#3B9DD2] text-center font-bold"
//                 />
//               </div>
//               <div className="mb-5">
//                 <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
//                   مدة التسليم
//                 </label>
//                 <input
//                   value={`${deliveryTime}`}
//                   type="text"
//                   className="bg-gray-200  text-sm rounded-lg block w-full p-2.5 text-[#3B9DD2] text-center font-bold"
//                 />
//               </div>
//             </div>

//             <div className="w-full text-center">
//               <button
//                 type="button"
//                 onClick={() => setIsOpen(true)}
//                 className="text-white bg-[#3B9DD2] font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/2"
//               >
//                 شراء
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//       {isOpen && (
//         <div className="bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-md my-5 z-10 absolute mx-auto p-5 max-w-xs w-full">
//           <img src={logo} className="w-[100px] mx-auto" />
//           <p className="my-3 font-bold text-center">
//             هل انت متأكد من شراء الخدمة؟
//           </p>
//           <div className="flex justify-between mt-4">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="bg-[#23255B] text-white px-4 py-2 rounded-lg"
//             >
//               رجوع
//             </button>
//             <button
//               onClick={buyaservice}
//               className="bg-[#3B9DD2] text-white px-4 py-2 rounded-lg"
//             >
//               شراء
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import logo from "../../assets/Logo.png";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; // أو أي أيقونة مناسبة

Buyservice.propTypes = {
  price: PropTypes.any,
  deliveryTime: PropTypes.any,
  serviceID: PropTypes.any,
};

export default function Buyservice({ price, deliveryTime, serviceID }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const token = localStorage.getItem("userToken");

  // ✅ Check URL params for success=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccessPopup(true);
    }
  }, []);

  function buyaservice() {
    axios
      .post(
        "https://skilly.runasp.net/api/Payment/start-payment",
        {
          serviceID,
          redirectUrl: "https://skilly-tau.vercel.app/?success=true",
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
      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-center p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="text-green-500 text-5xl flex justify-center mb-4">
              <FaCheckCircle />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              تم الدفع بنجاح!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              لأي استفسارات أو لمشاركة تفاصيل إضافية، تقدر تتواصل مع موفر الخدمة
              من خلال الشات.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              حسناً
            </button>
          </div>
        </div>
      )}

      {/* باقي الكود (نموذج الشراء + التأكيد) */}
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
                  value={`${price} ج.م`}
                  type="text"
                  className="bg-gray-200  text-sm rounded-lg block w-full p-2.5 text-[#3B9DD2] text-center font-bold"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  مدة التسليم
                </label>
                <input
                  value={`${deliveryTime}`}
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
              onClick={() => setIsOpen(false)}
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
