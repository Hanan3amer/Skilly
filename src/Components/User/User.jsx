import { useContext, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useFormik } from "formik";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Location from "../LocationModal/Location";
const governoratesWithCities = {
  القاهرة: ["القاهرة", "المعادي", "حلوان"],
  الجيزة: ["الجيزة", "6 أكتوبر", "الشيخ زايد", "البدر"],
  الإسكندرية: ["الإسكندرية"],
  الدقهلية: ["المنصورة", "المنصورة الجديدة", "طلخا", "ميت غمر"],
  الشرقية: ["الزقازيق", "العاشر من رمضان", "بلبيس", "فاقوس"],
  القليوبية: ["بنها", "شبرا الخيمة", "القناطر الخيرية"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "بلطيم"],
  الغربية: ["طنطا", "المحلة الكبرى", "زفتى", "سمنود"],
  المنوفية: ["شبين الكوم", "تلا", "الباجور", "أشمون"],
  البحيرة: ["دمنهور", "رشيد", "إدكو", "أبو المطامير"],
  دمياط: ["دمياط الجديدة","دمياط", "فارسكور", "الزرقا", "كفر سعد"],
  بورسعيد: ["بورسعيد", "شرق بورسعيد"],
  الإسماعيلية: ["الإسماعيلية", "التل الكبير", "فايد"],
  السويس: ["السويس"],
  "شمال سيناء": ["العريش", "الشيخ زويد", "رفح", "بئر العبد"],
  "جنوب سيناء": ["شرم الشيخ", "دهب", "نويبع", "طور سيناء"],
  "بني سويف": ["بني سويف", "الواسطى", "ناصر", "إهناسيا"],
  المنيا: ["المنيا", "ملوي", "دير مواس", "مغاغة"],
  أسيوط: ["أسيوط", "ديروط", "صدفا", "أبنوب"],
  سوهاج: ["سوهاج", "جرجا", "طهطا", "البلينا"],
  قنا: ["قنا", "قوص", "نجع حمادي", "دشنا"],
  الأقصر: ["الأقصر", "طيبة الجديدة", "الزينية", "البياضية"],
  أسوان: ["أسوان", "أسوان الجديدة", "كوم أمبو", "دراو"],
  "البحر الأحمر": ["الغردقة", "رأس غارب", "مرسى علم", "سفاجا"],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "باريس"],
  مطروح: ["مرسى مطروح", "الحمام", "العلمين", "سيدي براني"],
};

export default function User() {
  const { addUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState("male");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  const [userinfo, setUserinfo] = useState(
    JSON.parse(localStorage.getItem("formData")) || {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    }
  );

  const validationSchema = Yup.object({
    Governorate: Yup.string().required("المحافظة مطلوبة"),
    City: Yup.string().required("المدينة مطلوبة"),
    StreetName: Yup.string().required("اسم الشارع مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      Governorate: "",
      City: "",
      StreetName: "",
      Gender: "1",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("Governorate", values.Governorate);
        formData.append("City", values.City);
        formData.append("StreetName", values.StreetName);
        formData.append("Gender", values.Gender);
        formData.append("firstName", userinfo.firstName);
        formData.append("lastName", userinfo.lastName);
        formData.append("phoneNumber", userinfo.phoneNumber);
        formData.append("email", userinfo.email);
        if (selectedFile) {
          formData.append("Img", selectedFile);
        }
        await addUser(formData);
        navigate("/signin");
      } catch (error) {
        console.error("Error adding user:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGovernorateChange = (e) => {
    const selectedGovernorate = e.target.value;
    formik.handleChange(e);

    if (selectedGovernorate) {
      setCities(governoratesWithCities[selectedGovernorate] || []);
      formik.setFieldValue("City", "");
    } else {
      setCities([]);
    }
  };

  function handleOptionChange(option) {
    setActiveOption(option);
    formik.setFieldValue("Gender", option === "male" ? 1 : 0);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  }

  return (
    <div className="container my-10">
      <Location />
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xl mx-auto w-full"
        dir="rtl"
      >
        <h1 className="text-center text-[#3B9DD2] font-extrabold text-2xl my-2">
          {"بيانات المستخدم"}
        </h1>
        <h5 className="text-gray-900 font-bold text-sm text-center">
          برجاء اكمل بياناتك بعنايه
        </h5>
        <div className="border my-5 p-5 rounded-lg">
          <label
            htmlFor="Img"
            className="flex  text-[#23255B] border border-[#23255B] rounded-full text-base px-5 py-5 outline-none w-max cursor-pointer mx-auto font-[sans-serif]"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="user img"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <BsUpload className="w-10 h-10" />
            )}

            <input
              type="file"
              name="Img"
              id="Img"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
          <p className="text-[10px] text-center my-2 pb-5">
            برجاء اختيار صوره شخصيه
          </p>
          <div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.firstName}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, firstName: e.target.value })
                  }
                  name="firstName"
                  type="text"
                  id="firstName"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
                  disabled
                />
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.lastName}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, lastName: e.target.value })
                  }
                  name="lastName"
                  type="text"
                  id="lastName"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
                  disabled
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.phoneNumber}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, phoneNumber: e.target.value })
                  }
                  name="phoneNumber"
                  type="text"
                  id="phoneNumber"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder="01035623975"
                  disabled
                />
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.email}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, email: e.target.value })
                  }
                  name="email"
                  type="text"
                  id="email"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
                  disabled
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <select
                  value={formik.values.Governorate}
                  onChange={handleGovernorateChange}
                  onBlur={formik.handleBlur}
                  name="Governorate"
                  id="Governorate"
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.Governorate && formik.errors.Governorate
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="">اختر المحافظة</option>
                  {Object.keys(governoratesWithCities).map((governorate) => (
                    <option key={governorate} value={governorate}>
                      {governorate}
                    </option>
                  ))}
                </select>
                {formik.touched.Governorate && formik.errors.Governorate && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.Governorate}
                  </div>
                )}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <select
                  value={formik.values.City}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="City"
                  id="City"
                  disabled={!formik.values.Governorate}
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.City && formik.errors.City
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="">اختر المدينة</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {formik.touched.City && formik.errors.City && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.City}
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.StreetName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="StreetName"
                  type="text"
                  id="StreetName"
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.StreetName && formik.errors.StreetName
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="اسم الشارع"
                />
                {formik.touched.StreetName && formik.errors.StreetName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.StreetName}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center gap-3">
            <div
              onClick={() => handleOptionChange("male")}
              className={`cursor-pointer text-sm font-medium py-1 text-center md:px-20 rounded-lg w-full ${
                activeOption === "male"
                  ? "text-white bg-[#23255B]"
                  : "text-[#5B5B68] bg-[#D9D9D95C]"
              }`}
            >
              ذكر
            </div>
            <div
              onClick={() => handleOptionChange("female")}
              className={`cursor-pointer text-sm font-medium py-1 text-center md:px-20 rounded-lg w-full ${
                activeOption === "female"
                  ? "text-white bg-[#23255B]"
                  : "text-[#5B5B68] bg-[#D9D9D95C]"
              }`}
            >
              أنثي
            </div>
          </div>
          <div className="text-center my-5">
            <button
              type="submit"
              className="text-center w-1/2 bg-[#3B9DD2] px-10 py-1.5 rounded-lg text-white disabled:opacity-50"
              disabled={loading || !formik.isValid}
            >
              {loading ? <span>جاري التحميل...</span> : "حفظ"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
