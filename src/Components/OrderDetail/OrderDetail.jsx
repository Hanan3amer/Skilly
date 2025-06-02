import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { id } = useParams();
  const [service, setServices] = useState([]);
  const token = localStorage.getItem("userToken");
  function getDetail(serviceId) {
    axios
      .get(
        `https://skilly.runasp.net/api/UserProfile/requestServices/GetRequestsBy/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setServices(res.data.service);
      });
  }

  useEffect(() => {
    getDetail(id);
  }, [id]);
  return (
    <>
      <div className="container">
        <h1 className="text-[#27AAE1] text-center font-bold text-2xl my-5">
          تفاصيل الطلب
        </h1>
        <div className="border-2 p-5 rounded-lg border-gray-500 max-w-lg mx-auto bg-gray-200 my-5">
          <div className="max-w-sm mx-auto" dir="rtl">
            {service && (
              <div>
                <div className="mb-5">
                  <label
                    htmlFor="base-input"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    عنوان الخدمه
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={service.name}
                    id="base-input"
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  />
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative w-full mb-5 group">
                    <label
                      htmlFor="base-input"
                      className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      السعر
                    </label>
                    <input
                      type="text"
                      name="Price"
                      value={service.price}
                      disabled
                      id="base-input"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    />
                  </div>

                  <div className="relative w-full mb-5 group">
                    <label
                      htmlFor="base-input"
                      className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      مدة التسليم
                    </label>
                    <input
                      type="text"
                      name="Deliverytime"
                      value={service.deliverytime}
                      disabled
                      id="base-input"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    الملاحظات
                  </label>
                  <textarea
                    name="Notes"
                    value={service.notes}
                    id="message"
                    rows={4}
                    disabled
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                    placeholder="اكتب ملاحظاتك هنا...."
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    الصور
                  </label>
                  <ul className="flex gap-5 flex-wrap">
                    {service.images?.map((media, index) => (
                      <li key={index}>
                        <motion.img
                          whileHover={{ scale: 0.9 }}
                          whileTap={{ scale: 0.8 }}
                          src={media.img}
                          className="rounded-xl cursor-pointer h-16 w-20 object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    الفيديو
                  </label>

                  <div>
                    <motion.video
                      whileHover={{ scale: 0.9 }}
                      whileTap={{ scale: 0.8 }}
                      src={service.video}
                      className="rounded-xl cursor-pointer h-60 w-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
