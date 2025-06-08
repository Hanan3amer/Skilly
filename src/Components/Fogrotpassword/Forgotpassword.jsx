import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
export default function Forgotpassword() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  function HandelForgotpassword(formValues) {
    axios
      .post(`https://skilly.runasp.net/api/Auth/reset-password`, formValues)
      .then((ApiReasponse) => {
        if (ApiReasponse?.data?.success === true) {
          localStorage.setItem("useremail", formValues.email);
          navigate("/verification");
        }
      })
      .catch((ApiReasponse) => {
        setApiError(ApiReasponse?.data?.message);
      });
  }
  let Schema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is Required"),
  });

  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Schema,
    onSubmit: HandelForgotpassword,
  });

  return (
    <>
      <div className="container my-20">
        <h1 className="text-center text-[#3B9DD2] font-extrabold text-4xl">
          نسيت كلمة المرور
        </h1>
        <h3 className="text-center text-black font-extrabold my-7">
          ادخل رقم البريد الالكتروني المرتبط بالحساب
        </h3>
        {apiError ? (
          <div
            className="py-3 m-2 text-sm text-red-500 rounded-md text-center bg-red-100"
            role="alert"
          >
            <span className="font-medium ">{apiError}</span>
          </div>
        ) : null}
        <div className="border border-gray-200 p-8 rounded-xl lg:w-[550px] mx-auto">
          <h3 className="flex justify-end py-3">: ارسال الي</h3>
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-sm mx-auto w-full"
            dir="rtl"
          >
            <div className="mb-5">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="email"
                  className="bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:ring-1 focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder="البريد الالكتروني"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#3B9DD2] text-white rounded-md p-1.5 mx-auto"
            >
              التالي
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
