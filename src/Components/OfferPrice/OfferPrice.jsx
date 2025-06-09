import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
OfferPrice.propTypes = {
  serviceID: PropTypes.any,
  onClose: PropTypes.any,
};
export default function OfferPrice({ serviceID, onClose }) {
  const token = localStorage.getItem("userToken");
  function addOffer(values) {
    axios
      .post(`https://skilly.runasp.net/api/OfferSalary/AddOffer`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("تم إرسال عرضك بنجاح");
          if (onClose) {
            setTimeout(() => {
              onClose();
            }, 1000);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }
  let Schema = Yup.object().shape({
    salary: Yup.number().required("السعر مطلوب"),
    deliverytime: Yup.string().required("مدة التسليم مطلوبة"),
    notes: Yup.string().required(
      "برجاء ادخال الملاحظات لاداء الخدمة علي أكمل وجه"
    ),
  });

  let formik = useFormik({
    initialValues: {
      salary: 0,
      deliverytime: "",
      notes: "",
      serviceId: serviceID,
    },
    validationSchema: Schema,
    onSubmit: addOffer,
  });
  return (
    <div className="bg-gray-100 -translate-x-1/2 -translate-y-1/2 rounded-md my-5 z-10 absolute mx-auto p-5 max-w-md w-full">
      <ToastContainer className="text-center mx-auto" />
      <div className="bg-[#3B9DD2] text-white px-20 py-3 rounded-lg text-center">
        عرض السعر
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md mx-auto mt-14"
        dir="rtl"
      >
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
              السعر
            </label>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B9DD2] font-bold pointer-events-none">
                ج.م
              </span>
              <input
                name="salary"
                onBlur={formik.handleBlur}
                value={formik.values.salary}
                onChange={formik.handleChange}
                className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
              مدة التسليم
            </label>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B9DD2] font-bold pointer-events-none">
                يوم
              </span>
              <input
                name="deliverytime"
                onBlur={formik.handleBlur}
                value={formik.values.deliverytime}
                onChange={formik.handleChange}
                type="text"
                className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
            ملاحظات
          </label>
          <textarea
            name="notes"
            onBlur={formik.handleBlur}
            value={formik.values.notes}
            onChange={formik.handleChange}
            type="text"
            className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-5 placeholder:text-[#3B9DD2] placeholder:text-center placeholder:font-bold"
          />
        </div>

        <div className=" text-center flex justify-center items-center gap-5">
          <button
            type="submit"
            className="text-white bg-[#3B9DD2] font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            ارسال
          </button>
        </div>
      </form>
    </div>
  );
}
