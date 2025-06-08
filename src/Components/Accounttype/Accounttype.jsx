import { useNavigate } from "react-router-dom";
import { useTypeContext } from "../../Context/UserType";
import { useState } from "react";
import Loading from "../Loading/Loading";
export default function Accounttype() {
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const { Value, setValue } = useTypeContext();
  const navigate = useNavigate();

  if (loading) {
    return <Loading></Loading>;
  }

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    setError("");
    const userType =
      selectedValue === "provider" ? 1 : selectedValue === "user" ? 0 : 2;
    localStorage.setItem("userType", userType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Value) {
      setError("يرجى اختيار نوع الحساب قبل المتابعة");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate("/signup");
    }, 500);
  };

  return (
    <>
      <div className="my-20">
        <h1 className="mb-5 font-bold text-[#3B9DD2] text-center text-[48px]">
          اختر نوع الحساب
        </h1>
        <h2 className="mb-5 font-bold text-black text-center text-[16px]">
          قم باختيار نوع الحساب للإنضمام
        </h2>
        {Error ? (
          <div
            className="py-3 m-2 text-sm text-red-500 rounded-md text-center bg-red-100"
            role="alert"
          >
            <span className="font-medium ">{Error}</span>
          </div>
        ) : null}
        <div className="container">
          <div className="border p-5 rounded-lg border-gray-200">
            <form onSubmit={handleSubmit}>
              <ul className="grid w-full gap-10 md:grid-cols-2 py-5">
                <li>
                  <input
                    type="radio"
                    id="provider"
                    name="userType"
                    value="provider"
                    checked={Value === "provider"}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="provider"
                    className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-[#D9D9D95C] rounded-lg cursor-pointer peer-checked:border-2 peer-checked:border-gray-300 peer-checked:bg-blue-50 peer-checked:text-black hover:text-gray-600 hover:bg-gray-100"
                  >
                    <div className="block">
                      <div className="w-full text-lg font-semibold text-center">
                        <i
                          className="fa-solid fa-briefcase text-6xl"
                          style={{ color: "#000000" }}
                        />
                        <h6 className="text-[#00000db0] font-bold text-xl py-2">
                          موفر الخدمة
                        </h6>
                      </div>
                      <p className="text-[#5B5B68] py-2 w-[200px] mx-auto text-[14px] text-center">
                        موفر الخدمه هو الشخص الذي لديه مهاره معينه يقدمها كخدمه
                        للمستخدمين
                      </p>
                    </div>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="user"
                    name="userType"
                    value="user"
                    checked={Value === "user"}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <label
                    htmlFor="user"
                    className="inline-flex items-center justify-center w-full p-5 text-gray-500 bg-[#D9D9D95C] rounded-lg cursor-pointer peer-checked:border-2 peer-checked:border-gray-300 peer-checked:bg-blue-50 peer-checked:text-black hover:text-gray-600 hover:bg-gray-100"
                  >
                    <div className="block">
                      <div className="w-full text-lg font-semibold text-center">
                        <i
                          className="fa-solid fa-user text-6xl"
                          style={{ color: "#000000" }}
                        />
                        <h6 className="text-[#00000db0] font-bold text-xl py-2">
                          مستخدم
                        </h6>
                      </div>
                      <p className="text-[#5B5B68] py-2 w-[200px] mx-auto text-[14px] text-center">
                        المستخدم هو الشخص الذي يبحث عن خدمه من التي يقدمها موفري
                        الخدمات
                      </p>
                    </div>
                  </label>
                </li>
              </ul>
              <div className="next w-full text-center py-3">
                <button
                  type="submit"
                  className="bg-[#3B9DD2] w-full p-2 text-white rounded-lg text-[24px]"
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
      </div>
    </>
  );
}
