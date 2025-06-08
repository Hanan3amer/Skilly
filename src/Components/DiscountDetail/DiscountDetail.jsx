import { Link, useLocation } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion";
export default function DiscountDetail() {
  const [reviews, setReviews] = useState([]);
  const { state } = useLocation();
  const service = state?.service;
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  useEffect(() => {
    if (service?.id) {
      axios
        .get(
          `https://skilly.runasp.net/api/Provider/Review/GetReviewsBy/${service.id}`
        )
        .then((res) => {
          setReviews(res.data.reviews.reviews);
        })
        .catch((err) => console.error("Failed to fetch reviews:", err));
    }
  }, [service]);

  return (
    <>
      <div className="container">
        <h1 className="text-[#27AAE1] text-center font-bold text-2xl my-5">
          تفاصيل الخدمة
        </h1>
        <div className="border-2 p-5 rounded-lg border-gray-300 max-w-lg mx-auto bg-gray-200 my-5">
          <div className="max-w-sm mx-auto" dir="rtl">
            {service && (
              <div>
                <Slider {...settings} className="mb-10">
                  {service.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.img}
                      className="mx-auto rounded-lg h-[200px] w-full"
                    />
                  ))}
                </Slider>
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
                <div className="mb-5">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                  >
                    وصف الخدمه
                  </label>
                  <textarea
                    name="Notes"
                    value={service.description}
                    id="message"
                    rows={4}
                    disabled
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                    placeholder="اكتب ملاحظاتك هنا...."
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
                  <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                    الفيديو
                  </label>

                  <motion.video
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    src={service.video}
                    className="rounded-xl cursor-pointer h-60 w-full object-cover mb-3"
                    controls
                    autoPlay
                    loop
                    muted
                  />
                </div>
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <label className="block mb-2 text-sm font-bold text-gray-900">
                      التقييمات
                    </label>
                    <Link to={`/allreviews/${service.id}`}>
                      <p className="text-sm mb-2 font-bold text-gray-900 flex justify-center items-center">
                        عرض المزيد
                        <IoIosArrowRoundBack className="w-5 h-5 mt-1 font-bold" />
                      </p>
                    </Link>
                  </div>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 rounded-xl p-4  mb-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={review.userImage}
                              alt="user"
                              className="w-10 h-10 rounded-full"
                            />
                            <h3 className="font-bold text-gray-800">
                              {review.userName}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {review.feedback}
                        </p>
                        <div
                          className="flex gap-1 text-yellow-400 text-lg"
                          dir="ltr"
                        >
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center my-5 text-red-400">
                      لا توجد تقييمات لهذه الخدمة
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
