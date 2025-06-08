import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export default function Verification() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const email = localStorage.getItem("useremail");
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      setOtpValues((prev) => {
        const newValues = [...prev];
        newValues[index] = "";
        return newValues;
      });
      if (index > 0) inputRefs.current[index - 1].focus();
    } else if (/^[0-9a-zA-Z]$/.test(event.key)) {
      setOtpValues((prev) => {
        const newValues = [...prev];
        newValues[index] = event.key;
        return newValues;
      });
      if (index < inputRefs.current.length - 1)
        inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");
    const newValues = data.split("").slice(0, 4);
    setOtpValues(newValues);
    if (newValues.length === 4) inputRefs.current[3].focus();
  };

  const handleSubmit = async () => {
    const code = otpValues.join("");

    if (!code || code.length < 4) {
      setErrorMessage("Please enter a valid 4-character code.");
      return;
    }
    if (!email) {
      setErrorMessage(
        "No email found. Please restart the verification process."
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://skilly.runasp.net/api/Auth/verify-code",
        { code, email }
      );
      if (response?.data?.success) {
        navigate("/updatepassword");
      } else {
        setErrorMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error(
        "Verification error:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Error verifying code. Please try again."
      );
    }
  };

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
          {email}
        </span>
      </div>
      <div className="container mx-auto border border-gray-200 rounded-md px-10 py-5">
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
          التالي
        </button>
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}
