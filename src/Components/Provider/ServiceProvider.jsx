import { useState, useEffect, useContext } from "react";
import { BsUpload } from "react-icons/bs";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProviderContext } from "../../Context/ProviderContext";
import Location from "../LocationModal/Location";

export default function ServiceProvider() {
  const { addProvider } = useContext(ProviderContext);
  const [activeOption, setActiveOption] = useState("male");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
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
    دمياط: ["دمياط الجديدة", "دمياط", "فارسكور", "الزرقا", "كفر سعد"],
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
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get(
        "https://skilly.runasp.net/api/Category/getAllCategories"
      );
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  function handleOptionChange(option) {
    setActiveOption(option);
    formik.setFieldValue("Gender", option === "male" ? "1" : "0");
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  }

  function handlePdfChange(event) {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  }

  const [userinfo, setUserinfo] = useState(
    JSON.parse(localStorage.getItem("formData"))
  );
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
  async function addProviderProfile(values) {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("firstName", userinfo.firstName);
      formData.append("lastName", userinfo.lastName);
      formData.append("phoneNumber", userinfo.phoneNumber);
      formData.append("email", userinfo.email);

      formData.append("Governorate", values.Governorate);
      formData.append("City", values.City);
      formData.append("StreetName", values.StreetName);
      formData.append("Gender", values.Gender);
      formData.append("Age", values.Age);
      formData.append("NumberOfYearExperience", values.NumberOfYearExperience);
      formData.append("BriefSummary", values.BriefSummary);
      formData.append("categoryId", values.categoryId);

      if (selectedFile) {
        formData.append("Img", selectedFile);
      }

      if (pdfFile) {
        formData.append("NationalNumberPDF", pdfFile);
      }

      const response = await addProvider(formData);
      console.log("response", response);
      if (response.status === 201) {
        navigate(`/serviceprovider`);
      } else {
        setError("حدث خطأ أثناء إرسال البيانات");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال البيانات");
    } finally {
      setLoading(false);
    }
  }

  let formik = useFormik({
    initialValues: {
      firstName: userinfo?.firstName || "",
      lastName: userinfo?.lastName || "",
      phoneNumber: userinfo?.phoneNumber || "",
      email: userinfo?.email || "",
      Governorate: "",
      City: "",
      StreetName: "",
      Gender: "1",
      Age: "",
      NumberOfYearExperience: "",
      BriefSummary: "",
      categoryId: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.Governorate || values.Governorate === "Governorate") {
        errors.Governorate = "يرجى اختيار المحافظة";
      }
      if (!values.City || values.City === "City") {
        errors.City = "يرجى اختيار المدينة";
      }
      if (!values.StreetName) {
        errors.StreetName = "يرجى إدخال اسم الشارع";
      }
      if (!values.Age) {
        errors.Age = "يرجى إدخال العمر";
      }
      if (!values.NumberOfYearExperience) {
        errors.NumberOfYearExperience = "يرجى إدخال عدد سنوات الخبرة";
      }
      if (!values.BriefSummary) {
        errors.BriefSummary = "يرجى إدخال نبذة مختصرة عنك";
      }
      if (!values.categoryId) {
        errors.categoryId = "يرجى اختيار التصنيف";
      }
      if (!selectedFile) {
        errors.Img = "يرجى اختيار صورة شخصية";
      }
      if (!pdfFile) {
        errors.NationalNumberPDF = "يرجى إرفاق صورة البطاقة الشخصية";
      }
      return errors;
    },
    onSubmit: (values) => addProviderProfile(values),
  });

  return (
    <div className="container">
      <Location />
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xl mx-auto w-full"
        dir="rtl"
      >
        <h1 className="text-center text-[#3B9DD2] font-extrabold text-2xl">
          بيانات موفر الخدمة
        </h1>
        <h5 className="text-gray-900 font-bold text-sm text-center">
          برجاء اكمل بياناتك بعنايه
        </h5>
        {error && (
          <div className="py-3 m-2 text-sm text-red-500 rounded-md text-center bg-red-100">
            <span className="font-medium">{error}</span>
          </div>
        )}
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
            />
          </label>
          <p className="text-[10px] text-center my-2 pb-5">
            برجاء اختيار صوره شخصيه{" "}
            {formik.errors.Img && (
              <span className="text-red-500 block mt-1">
                {formik.errors.Img}
              </span>
            )}
          </p>
          <div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.firstName || ""}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, firstName: e.target.value })
                  }
                  name="firstName"
                  type="text"
                  id="firstName"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3    placeholder:text-[#5B5B68]"
                  placeholder="الاسم الأول"
                />
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.lastName || ""}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, lastName: e.target.value })
                  }
                  name="lastName"
                  type="text"
                  id="lastName"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                  placeholder="الاسم الأخير"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.phoneNumber || ""}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, phoneNumber: e.target.value })
                  }
                  name="phoneNumber"
                  type="text"
                  id="phoneNumber"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                  placeholder="رقم الهاتف"
                />
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={userinfo?.email || ""}
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, email: e.target.value })
                  }
                  name="email"
                  type="text"
                  id="email"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                  placeholder="البريد الإلكتروني"
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
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-2  placeholder:text-[#5B5B68] ${
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
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-2  placeholder:text-[#5B5B68] ${
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
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                  placeholder="اسم الشارع"
                />
                {formik.touched.StreetName && formik.errors.StreetName && (
                  <div className="text-red-500 text-sm py-1">
                    {formik.errors.StreetName}
                  </div>
                )}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.Age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="Age"
                  type="text"
                  id="Age"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                  placeholder="العمر"
                />
                {formik.touched.Age && formik.errors.Age && (
                  <div className="text-red-500 text-sm py-1">
                    {formik.errors.Age}
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.NumberOfYearExperience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="NumberOfYearExperience"
                  type="text"
                  id="NumberOfYearExperience"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                  placeholder="عدد سنوات الخبرة"
                />
                {formik.touched.NumberOfYearExperience &&
                  formik.errors.NumberOfYearExperience && (
                    <div className="text-red-500 text-sm py-1">
                      {formik.errors.NumberOfYearExperience}
                    </div>
                  )}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <select
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="categoryId"
                  id="categoryId"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-2  placeholder:text-[#5B5B68]"
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} - {category.professionName}
                    </option>
                  ))}
                </select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <div className="text-red-500 text-sm py-1">
                    {formik.errors.categoryId}
                  </div>
                )}
              </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <textarea
                value={formik.values.BriefSummary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="BriefSummary"
                id="BriefSummary"
                rows="4"
                className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3  placeholder:text-[#5B5B68]"
                placeholder="نبذة مختصرة عنك"
              ></textarea>
              {formik.touched.BriefSummary && formik.errors.BriefSummary && (
                <div className="text-red-500 text-sm py-1">
                  {formik.errors.BriefSummary}
                </div>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label
                htmlFor="NationalNumberPDF"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                صورة البطاقة الشخصية (PDF)
              </label>
              <input
                type="file"
                name="NationalNumberPDF"
                id="NationalNumberPDF"
                onChange={handlePdfChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                accept=".pdf"
              />
              <p className="mt-1 text-sm text-gray-500">
                PDF فقط (الحد الأقصى 10 ميجابايت)
              </p>
              {formik.errors.NationalNumberPDF && (
                <div className="text-red-500 text-sm py-1">
                  {formik.errors.NationalNumberPDF}
                </div>
              )}
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
              className="text-center w-1/2 bg-[#3B9DD2] px-10 py-1.5 rounded-lg text-white"
              disabled={loading}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : "حفظ"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
