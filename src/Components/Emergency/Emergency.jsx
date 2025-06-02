import { useEffect, useState } from "react";
import eme from "../../assets/eme.png";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import EmergencyProvidersModal from "./EmergencyProvidersModal";
export default function Emergency() {
  const [categories, setCategories] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [providers, setProviders] = useState([]);
  const token = localStorage.getItem("userToken");
  function HandleRequest(formValues) {
    axios
      .post(
        `https://skilly.runasp.net/api/Emergency/create-emergency-request`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response);

          setShowConfirmationModal(true);
          axios
            .get(
              `https://skilly.runasp.net/api/Emergency/nearby-providers/${response.data.requestId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((apiResponse) => {
              setProviders(apiResponse.data.result);
              setTimeout(() => {
                setShowConfirmationModal(false);
                setShowProvidersModal(true);
              }, 6000);
            });
        }
      });
  }
  useEffect(() => {
    function fetchCategories() {
      axios
        .get("https://skilly.runasp.net/api/Category/getAllCategories")
        .then((res) => {
          setCategories(res.data.categories);
        });
    }
    fetchCategories();
  }, []);

  let Schema = Yup.object().shape({
    categoryId: Yup.string().required("يرجى اختيار نوع الطوارئ"),
    problemDescription: Yup.string().required(
      "يرجى وصف المشكلة لمساعدك في حلها بأسرع وقت"
    ),
  });

  let formik = useFormik({
    initialValues: {
      categoryId: "",
      problemDescription: "",
    },
    validationSchema: Schema,
    onSubmit: HandleRequest,
  });
  return (
    <div className="container mx-auto p-4 md:my-20">
      <div className="border border-gray-300 rounded-xl p-5 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="md:w-1/2 w-full mb-6 md:mb-0">
            <img
              src={eme}
              alt="emergency"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2 w-full flex flex-col items-center text-center">
            <h2 className="text-black text-xl md:text-2xl font-bold mb-1">
              طلب مساعدة طارئة
            </h2>
            <p className="text-sm text-black">هل تواجهك مشكلة عاجلة؟</p>
            <p className="text-xs text-black mb-4">
              احصل على الدعم السريع من أقرب مقدم خدمة متاح الآن
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="w-full px-4 md:px-0"
              dir="rtl"
            >
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-right text-gray-900">
                  نوع الطوارئ
                </label>
                <div className="flex justify-start flex-col">
                  <select
                    name="categoryId"
                    id="categoryId"
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#d23b3b] block w-full p-3  placeholder:text-[#5B5B68]"
                  >
                    <option value="">اختر نوع الطوارئ</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <div className="text-red-500 text-xs mt-1 text-right">
                      {formik.errors.categoryId}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-right text-gray-900">
                  وصف المشكلة
                </label>
                <textarea
                  name="problemDescription"
                  rows={4}
                  value={formik.values.problemDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-100 focus:border text-sm rounded-lg p-2.5 text-[#d23b3b] text-right font-bold w-full  focus:outline-none focus:border-[#d23b3b]"
                />
                {formik.touched.problemDescription &&
                  formik.errors.problemDescription && (
                    <div className="text-red-500 text-xs mt-1 text-right">
                      {formik.errors.problemDescription}
                    </div>
                  )}
              </div>
              <button
                type="submit"
                className="bg-red-500 w-1/2 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg  transition-colors duration-300"
              >
                إرسال
              </button>
            </form>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showConfirmationModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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
                تم ارسال طلبك بنجاح برجاء الانتظار وسيتم ارسال موفر خدمة للمشكلة
                في اقرب وقت
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

      <EmergencyProvidersModal
        show={showProvidersModal}
        onClose={() => setShowProvidersModal(false)}
        providers={providers}
        setProviders={setProviders}
      />
    </div>
  );
}
