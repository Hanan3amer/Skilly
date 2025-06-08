import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const handleUpdate = async (formValues) => {
    try {
      const response = await axios.post(
        `https://skilly.runasp.net/api/Auth/update-password`,
        formValues
      );
      if (response.data.success === true) {
        navigate("/signin");
      }
    } catch (error) {
      console.error(
        "Error updating password:",
        error.response?.data || error.message
      );
    }
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Password must be at least 8 characters long, contain one letter, one number, and one special character."
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("useremail"),
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleUpdate,
  });

  return (
    <div className="container my-20">
      <div className="border border-gray-200 p-5 lg:w-1/2 mx-auto rounded-xl">
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-sm mx-auto w-full"
          dir="rtl"
        >
          <h1 className="text-center text-[#3B9DD2] font-extrabold text-4xl my-7">
            تغيير كلمة المرور
          </h1>
          <p className="text-sm text-center my-7 text-[#23255B] font-bold">
            قم بتغيير كلمة المرور بكلمة مرور جديدة
          </p>
          <div className="mb-5">
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none block w-full p-3 ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-500"
                  : "focus:border-[#3B9DD2]"
              }`}
              placeholder="كلمة المرور الجديدة"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <span className="text-red-500 text-sm">
                {formik.errors.newPassword}
              </span>
            )}
          </div>
          <div className="mb-5">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none block w-full p-3 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "focus:border-[#3B9DD2]"
              }`}
              placeholder="تأكيد كلمة المرور"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </span>
              )}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="text-white bg-[#3B9DD2] hover:bg-[#5aadd9] focus:ring-1 focus:outline-none font-medium rounded-lg text-sm w-3/4 px-5 py-2.5"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
