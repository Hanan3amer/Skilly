import { useState } from "react";
import vector from "../../assets/Vector.svg";
import { useFormik } from "formik";
import { useTypeContext } from "../../Context/UserType";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [ApiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { Value } = useTypeContext();

  const Schema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Name minimum length is 2")
      .max(10, "Name max length is 10")
      .required("الاسم الاول مطلوب"),
    lastName: Yup.string()
      .min(2, "Name minimum length is 2")
      .max(10, "Name max length is 10")
      .required("الاسم الاخير مطلوب"),
    phoneNumber: Yup.string()
      .matches(
        /^(\+20|0020|0)?1[0-2,5]{1}[0-9]{8}$/,
        "رقم الهاتف المدخل غير صحيح يجب ان يكون [رقم مصري]"
      )
      .required("رقم الهاتف مطلوب"),
    email: Yup.string()
      .email("البريد الالكتروني المدخل غير صحيح")
      .required("البريد الالكتروني مطلوب"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,}$/,
       "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف واحد على الأقل، ورقم واحد، وحرف خاص واحد."
      )
      .required("كلمة المرور مطلوبة"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      userType: Value === "provider" ? 1 : 0,
      fcmToken: null,
    },
    validationSchema: Schema,
    onSubmit: HandleRegister,
  });

  async function HandleRegister(formvalues) {
    setLoading(true);
    try {
      const ApiResponse = await axios.post(
        `https://skilly.runasp.net/api/Auth/Register`,
        formvalues
      );
      if (ApiResponse?.status === 201) {
        localStorage.setItem("formData", JSON.stringify(formvalues));
        navigate("/verifyemail");
      }
      setLoading(false);
    } catch (ApiResponse) {
      setApiError(ApiResponse?.response?.data?.errors[0]);
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="container my-20">
        <div className=" border border-gray-200 rounded-lg p-10 max-w-lg mx-auto ">
          {ApiError ? (
            <div
              className="py-3 m-2 text-sm text-red-500 rounded-md text-center bg-red-100"
              role="alert"
            >
              <span className="font-medium ">{ApiError}</span>
            </div>
          ) : null}
          <form
            className="max-w-md mx-auto w-full"
            dir="rtl"
            onSubmit={formik.handleSubmit}
          >
            <h1 className="text-center text-[#3B9DD2] font-extrabold text-3xl mb-10">
              إنشاء حساب
            </h1>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  name="firstName"
                  type="text"
                  id="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="\ bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=" الاسم الاول"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm py-2">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  name="lastName"
                  type="text"
                  id="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border  focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder="الاسم الاخير"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm py-2">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                name="email"
                type="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                placeholder=" البريد الالكتروني"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm py-2">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                name="password"
                type="password"
                id="password"
                autoComplete="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                placeholder="كلمه المرور"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm py-2">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <div className="absolute inset-y-0 end-2 flex items-center ps-3.5 pointer-events-none">
                <img src={vector} />
              </div>
              <input
                dir="rtl"
                name="phoneNumber"
                type="tel"
                id="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                placeholder="رقم الهاتف"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm py-2">
                  {formik.errors.phoneNumber}
                </div>
              )}
            </div>
            <div className="flex justify-center w-full items-center">
              <button
                type="submit"
                className="text-white bg-[#3B9DD2]  focus:ring-1 focus:outline-none focus:ring-[#3B9DD2] font-medium rounded-lg text-sm w-full hover:bg-[#3b9dd2d4] px-5 py-2.5 text-center dark:bg-[#3B9DD2] dark:hover:bg-[#3B9DD2] dark:focus:ring-[#3B9DD2] "
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "التالي"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
