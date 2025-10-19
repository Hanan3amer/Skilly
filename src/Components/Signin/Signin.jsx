import Hide from "../../assets/Hide.svg";
import google from "../../assets/google.svg";
import or from "../../assets/or.svg";
import vector from "../../assets/Vector.svg";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { AuthContext } from "../../Context/Authcontext";
import * as Yup from "yup";
import Loading from "../Loading/Loading";
import { getCurrentUser } from "../../utils/hooks/useCurrentUser";
export default function Signin() {
  const navigate = useNavigate();
  const { setUserLogin } = useContext(AuthContext);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "720385409460-tvrhojnr1tfqfor7lserus6mhah8l488.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
  }, []);
  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log("ID Token:", idToken);

    axios
      .post("https://skilly.runasp.net/api/Auth/login-google", {
        idToken: idToken,
      })
      .then(async (res) => {
        if (res?.data?.success === true) {
          const token = res.data.token;
          localStorage.setItem("userToken", token);
          localStorage.removeItem("lastLogout");
          try {
            const userData = await getCurrentUser();
            setUserLogin({ id: userData.id });
            if (userData.userType === 1) {
              navigate("/serviceprovider");
            } else if (userData.userType === 0) {
              navigate("/");
            } else {
              navigate("/signin");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setApiError("حدث خطأ أثناء تسجيل الدخول");
          }
        } else {
          setApiError("فشل تسجيل الدخول بحساب Google.");
        }
      })
      .catch((err) => {
        console.error("فشل تسجيل الدخول:", err);
      });
  };

  const handleGoogleLogin = () => {
    window.google.accounts.id.prompt();
  };
  function HandleLogin(formValues) {
    setLoading(true);
    setApiError("");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    localStorage.removeItem("providerData");
    axios
      .post(`https://skilly.runasp.net/api/Auth/Login`, formValues)
      .then(async (ApiResponse) => {
        if (ApiResponse?.data?.success === true) {
          const token = ApiResponse?.data?.token;
          localStorage.setItem("userToken", token);
          localStorage.removeItem("lastLogout");
          try {
            const userData = await getCurrentUser();
            setUserLogin({ id: userData.id });
            if (userData.userType === 1) {
              navigate("/serviceprovider");
            } else {
              navigate("/");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setApiError("حدث خطأ أثناء تسجيل الدخول");
          }
        } else {
          setApiError(ApiResponse?.data?.message);
        }
      })
      .catch((error) => {
        console.error("Login API error:", error);
        setApiError("حدث خطأ أثناء تسجيل الدخول");
      })
      .finally(() => setLoading(false));
  }
  let Schema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(
        /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/,
        "phone number is incorrect[Egyptian Number]"
      )
      .required("Phone number is Required"),
    password: Yup.string().required("Password is Required"),
  });
  let formik = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Schema,
    onSubmit: HandleLogin,
  });
  if (loading) {
    return <Loading></Loading>;
  }
  return (
    <>
      <div className="container my-20">
        {apiError ? (
          <div
            className="py-3 m-2 text-sm text-red-500 rounded-md text-center bg-red-100"
            role="alert"
          >
            <span className="font-medium ">{apiError}</span>
          </div>
        ) : null}
        <form
          onSubmit={formik.handleSubmit}
          className="max-w-sm mx-auto w-full"
          dir="rtl"
        >
          <h1 className="text-center text-[#3B9DD2] font-extrabold text-5xl my-7">
            تسجيل الدخول
          </h1>
          <div className="mb-5 ">
            <div className="relative">
              <div className="absolute inset-y-0 end-2 flex items-center ps-3.5 pointer-events-none">
                <img src={vector} />
              </div>
              <input
                name="phoneNumber"
                type="text"
                id="phoneNumber"
                autoComplete="username"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                placeholder="رقم الهاتف"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>
          </div>
          <div className="mb-5">
            <div className="relative">
              <div
                className="absolute inset-y-0 end-2 flex items-center ps-3.5 cursor-pointer"
                onClick={togglePassword}
              >
                <img src={Hide} alt="toggle password" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                placeholder="كلمة المرور"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center mb-5">
            <div className="flex items-center h-5">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                className="border border-[#3B9DD2] rounded-sm bg-white focus:ring-3 focus:ring-[#3B9DD2]  accent-[#3B9DD2]"
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <label
                htmlFor="rememberMe"
                className="ms-2 text-sm font-medium text-[#5B5B68] "
              >
                تذكرني
              </label>

              <Link to={"/forgotpassword"} className="text-[#3B9DD2]">
                هل نسيت كلمةالمرور؟
              </Link>
            </div>
          </div>

          <div className="mx-auto text-center w-full">
            <button
              type="submit"
              className="text-white bg-[#3B9DD2] hover:bg-[#5aadd9] focus:ring-1 focus:outline-none focus:ring-[#3B9DD2] font-medium rounded-lg text-sm w-full  px-10 py-2.5 text-center "
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
        <p className="text-center py-3">
          ليس لديك حساب ؟
          <Link to={"/accounttype"} className="text-[#3B9DD2]">
            سجل الان
          </Link>
        </p>
        <img src={or} className="mx-auto py-3" />
        <div className="flex items-center justify-center gap-5 py-3">
          <img
            className="cursor-pointer w-[50px]"
            src={google}
            onClick={handleGoogleLogin}
          />
        </div>
      </div>
    </>
  );
}
