import { useContext, useRef, useState } from "react";
import Loading from "../Loading/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/hooks/useCurrentUser";
import { AuthContext } from "../../Context/Authcontext";

export default function SubmitCode() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const formData = JSON.parse(localStorage.getItem("formData"));
  const Email = formData?.email;
  const { setUserLogin } = useContext(AuthContext);

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      setOtpValues((prev) => {
        const newValues = [...prev];
        newValues[index] = "";
        return newValues;
      });
      if (index > 0) inputRefs.current[index - 1].focus();
    } else if (/^[0-9]$/.test(event.key)) {
      setOtpValues((prev) => {
        const newValues = [...prev];
        newValues[index] = event.key;
        return newValues;
      });
      if (index < 3) inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const data = event.clipboardData.getData("text").replace(/\D/g, "");
    const newValues = data.split("").slice(0, 4);
    setOtpValues(newValues);
    inputRefs.current[Math.min(3, newValues.length - 1)].focus();
  };

  const handleSubmit = async () => {
    if (otpValues.some((v) => !v)) {
      setErrorMessage("Please fill all fields");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://skilly.runasp.net/api/Auth/verify-email",
        { code: otpValues.join(""), email: Email }
      );

      if (response.data?.success) {
        const userType = localStorage.getItem("userType") || "0";
        localStorage.setItem("userToken", response.data.token);
        const user = await getCurrentUser();
        setUserLogin({ id: user.id });

        navigate(userType === "1" ? "/provider" : "/user");
      } else {
        setErrorMessage(response.data?.message || "Invalid code");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-[26px] font-extrabold text-center text-[#3B9DD2]">
        التحقق
      </h1>
      <p className="text-[12px] text-center text-black">
        التحقق من ملكية الحساب
      </p>
      <div className="my-4 text-center">
        <h3 className="font-bold text-[12px]">
          قم بكتابة كود التحقق الذي تم ارساله إلي
        </h3>
        <span className="text-[#3B9DD2] underline text-[12px] font-bold">
          {Email}
        </span>
      </div>
      <div className="container mx-auto border rounded-md px-10 py-5">
        <div
          id="otp"
          className="flex flex-row justify-center text-center px-2 mt-5"
          onPaste={handlePaste}
        >
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otpValues[index]}
                ref={(el) => (inputRefs.current[index] = el)}
                className="m-2 h-12 w-12 text-center form-control rounded-xl bg-gray-100"
                onKeyDown={(event) => handleKeyDown(event, index)}
              />
            ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[#3B9DD2] w-full p-2 text-white rounded-md mt-4"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "التالي"}
        </button>
        {errorMessage ? (
          <div
            className="py-3 m-2 text-sm text-red-500 rounded-md text-center bg-red-100"
            role="alert"
          >
            <span className="font-medium ">{errorMessage}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
