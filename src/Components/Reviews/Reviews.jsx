import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useState } from "react";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
export default function Reviews({ serviceID }) {
  const token = localStorage.getItem("userToken");
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  function addReview(values) {
    console.log("بيانات الإرسال:", values);
    axios
      .post(
        `https://skilly.runasp.net/api/Provider/Review/AddServiceReview`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setShowConfirmationModal(true);
          formik.resetForm();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  let Schema = Yup.object().shape({
    feedback: Yup.string(),
    rating: Yup.number()
      .min(0.5, "من فضلك اختر تقييم")
      .required("التقييم مطلوب"),
  });

  let formik = useFormik({
    initialValues: {
      feedback: "",
      rating: 0,
      serviceId: serviceID,
    },
    validationSchema: Schema,
    onSubmit: addReview,
  });

  return (
    <>
      <div className="bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-md my-5 z-10 absolute mx-auto p-5 max-w-md w-full">
        <div className="bg-[#3B9DD2] text-white px-20 py-3 rounded-lg text-center">
          تقييم الخدمة
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-md mx-auto mt-14"
          dir="rtl"
        >
          <div className="mb-5">
            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
              كيف كانت تجربتك
            </label>
            <textarea
              name="feedback"
              onBlur={formik.handleBlur}
              value={formik.values.feedback}
              onChange={formik.handleChange}
              className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-5 placeholder:text-[#3B9DD2] placeholder:text-center placeholder:font-bold"
              placeholder="أكتب رأيك هنا..."
            />
          </div>

          <div className="mb-5 text-center">
            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
              التقييم
            </label>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const value = starIndex;
                const current = hoveredStar || formik.values.rating;

                return (
                  <span
                    key={value}
                    className="relative cursor-pointer"
                    onMouseEnter={() => setHoveredStar(value)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isHalf = e.nativeEvent.offsetX < rect.width / 2;
                      const finalValue = isHalf ? value - 0.5 : value;
                      formik.setFieldValue("rating", finalValue);
                    }}
                  >
                    {current >= value ? (
                      <FaStar className="text-yellow-400" size={24} />
                    ) : current >= value - 0.5 ? (
                      <FaStarHalfAlt className="text-yellow-400" size={24} />
                    ) : (
                      <FaRegStar className="text-gray-400" size={24} />
                    )}
                  </span>
                );
              })}
            </div>

            <div className="mt-2 text-sm text-gray-700">
              التقييم المختار: {formik.values.rating || 0} من 5
            </div>
            {formik.touched.rating && formik.errors.rating && (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.rating}
              </div>
            )}
          </div>

          <div className="text-center flex justify-center items-center gap-5">
            <button
              type="submit"
              className="text-white bg-[#3B9DD2] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              ارسال التقييم
            </button>
          </div>
        </form>
      </div>
      <AnimatePresence>
        {showConfirmationModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000053] bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#fff8f8] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaHeartCircleCheck className="text-[#d23b3b] text-7xl mx-auto" />
              <p className="py-4 text-center font-bold text-[#655757]">
                شكرا لك للتقيم تنمني لك تجربة ممتعة
              </p>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="block mx-auto mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
