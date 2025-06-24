import { useContext, useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useFormik } from "formik";
import { ProviderContext } from "../../Context/ProviderContext";
import { HiOutlineIdentification } from "react-icons/hi";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function ServiceProviderData() {
  const { addProvider, providerData, getProviderData } =
    useContext(ProviderContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEdit = queryParams.get("isEdit") === "true";

  const [activeOption, setActiveOption] = useState("male");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [previewID, setPreviewID] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleOptionChange(option) {
    setActiveOption(option);
    formik.setFieldValue("Gender", option === "male" ? "1" : "0");
  }

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
    async function fetchCategories() {
      try {
        const { data } = await axios.get(
          "https://skilly.runasp.net/api/Category/getAllCategories"
        );
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();

    if (isEdit && providerData) {
      formik.setValues({
        firstName: providerData.firstName || "",
        lastName: providerData.lastName || "",
        phoneNumber: providerData.phoneNumber || "",
        email: providerData.email || "",
        Gender: providerData.gender === "0" ? "0" : "1",
        NumberOfYearExperience: providerData.numberOfYearExperience || "",
        City: providerData.city || "",
        BriefSummary: providerData.briefSummary || "",
        StreetName: providerData.streetName || "",
        categoryId: providerData.categoryId || "",
        Governorate: providerData.governorate || "",
        Age: providerData.age || "",
      });

      setUserinfo({
        firstName: providerData.firstName || "",
        lastName: providerData.lastName || "",
        phoneNumber: providerData.phoneNumber || "",
        email: providerData.email || "",
      });
      if (providerData.gender == "0") {
        setActiveOption("male");
      } else {
        setActiveOption("female");
      }

      if (providerData.img) {
        setPreviewImage(providerData.img);
      }

      if (providerData.nationalNumberPDF) {
        setPreviewID(providerData.nationalNumberPDF);
      }
    }
  }, [isEdit, providerData]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  }
  function handleIDChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedID(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewID(imageUrl);
    }
  }
  const [userinfo, setUserinfo] = useState(
    JSON.parse(localStorage.getItem("formData"))
  );

  async function editProviderProfile(values) {
    setLoading(true);
    const formData = new FormData();

    formData.append("Gender", values.Gender);
    formData.append("NumberOfYearExperience", values.NumberOfYearExperience);
    formData.append("City", values.City);
    formData.append("BriefSummary", values.BriefSummary);
    formData.append("StreetName", values.StreetName);
    formData.append("categoryId", values.categoryId);
    formData.append("Governorate", values.Governorate);
    formData.append("Age", values.Age);
    formData.append("firstName", userinfo.firstName);
    formData.append("lastName", userinfo.lastName);

    if (selectedFile) {
      formData.append("Img", selectedFile);
    }
    if (selectedID) {
      formData.append("NationalNumberPDF", selectedID);
    }

    try {
      console.log(localStorage.getItem("userToken"));
      const response = await axios.put(
        "https://skilly.runasp.net/api/Provider/editServiceProvider",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث البيانات بنجاح");
        await getProviderData();
        navigate("/mainprofile");
      }
    } catch (error) {
      console.error("Error updating provider profile:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setLoading(false);
    }
  }

  async function addProviderProfile(values) {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    if (selectedFile) {
      formData.append("Img", selectedFile);
    }
    if (selectedID) {
      formData.append("NationalNumberPDF", selectedID);
    }

    formData.append("categoryId", values.categoryId);

    const response = await addProvider(formData);
    if (response.status === 201) {
      navigate(`/signin`);
    }
  }

  const validationSchema = Yup.object({
    NumberOfYearExperience: Yup.number()
      .min(0, "يجب أن تكون القيمة 0 أو أكثر")
      .required("هذا الحقل مطلوب"),
    City: Yup.string().required("هذا الحقل مطلوب"),
    StreetName: Yup.string().required("هذا الحقل مطلوب"),
    Governorate: Yup.string().required("هذا الحقل مطلوب"),
    Age: Yup.number().required("هذا الحقل مطلوب"),
    categoryId: Yup.string().required("هذا الحقل مطلوب"),
    BriefSummary: Yup.string().required("هذا الحقل مطلوب"),
  });

  let formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      Governorate: "",
      City: "",
      StreetName: "",
      Gender: "1",
      Age: "",
      categoryId: "",
      NumberOfYearExperience: "",
      BriefSummary: "",
      NationalNumberPDF: "",
    },
    validationSchema: isEdit ? validationSchema : null,
    onSubmit: (values) =>
      isEdit ? editProviderProfile(values) : addProviderProfile(values),
    enableReinitialize: true,
  });

  return (
    <div className="container my-10">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xl mx-auto w-full"
        dir="rtl"
      >
        <h1 className="text-center text-[#3B9DD2] font-extrabold text-2xl my-2">
          {isEdit ? "تعديل بيانات موفر الخدمة" : "بيانات موفر الخدمة"}
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
            />
          </label>
          <p className="text-[10px] text-center my-2 pb-5">
            {isEdit ? "يمكنك تغيير صورتك الشخصية" : "برجاء اختيار صوره شخصيه"}
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
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
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
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
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
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder="01035623975"
                  disabled={isEdit}
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
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
                  disabled={isEdit}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <select
                  value={formik.values.Governorate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="Governorate"
                  id="Governorate"
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.Governorate && formik.errors.Governorate
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="المحافظة">المحافظة</option>
                  {Object.keys(governoratesWithCities).map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
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
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.City && formik.errors.City
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="المدينه">المدينه</option>
                  {governoratesWithCities[formik.values.Governorate]?.map(
                    (city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    )
                  )}
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
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.Age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="Age"
                  type="text"
                  id="Age"
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.Age && formik.errors.Age
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="السن"
                />
                {formik.touched.Age && formik.errors.Age && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.Age}
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <select
                  value={formik.values.categoryId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    formik.setFieldValue("categoryId", selectedId);
                  }}
                  onBlur={formik.handleBlur}
                  name="categoryId"
                  id="categoryId"
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.categoryId && formik.errors.categoryId
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="">المهنة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.categoryId}
                  </div>
                )}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={formik.values.NumberOfYearExperience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="NumberOfYearExperience"
                  type="text"
                  id="NumberOfYearExperience"
                  className={`bg-gray-100 text-gray-900 text-sm rounded-lg focus:border focus:outline-none focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68] ${
                    formik.touched.NumberOfYearExperience &&
                    formik.errors.NumberOfYearExperience
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="عدد سنين الخبرة"
                />
                {formik.touched.NumberOfYearExperience &&
                  formik.errors.NumberOfYearExperience && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.NumberOfYearExperience}
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
          <div className="flex items-center flex-start my-5 gap-3 ">
            <div className="bg-gray-100 px-3 py-2 rounded-xl">
              <label
                htmlFor="NationalNumberPDF"
                className="flex  text-[#23255B]   text-base px-3 py-2 outline-none w-max cursor-pointer mx-auto font-[sans-serif]"
              >
                <HiOutlineIdentification className="w-10 h-8 " />

                <input
                  type="file"
                  name="NationalNumberPDF"
                  id="NationalNumberPDF"
                  className="hidden"
                  onChange={handleIDChange}
                  disabled={isEdit}
                />
              </label>
            </div>
            <p>
              {isEdit
                ? "لا يمكنك تغيير صورة هويتك الشخصية"
                : "برجاء تحميل صورة هويتك الشخصيه"}
            </p>
          </div>
          <div className="mb-5">
            <label
              htmlFor="BriefSummary"
              className="block mb-2 text-sm font-bold ps-2 text-gray-900 dark:text-white"
            >
              اكتب نبذه مختصره عنك
            </label>
            <textarea
              name="BriefSummary"
              id="BriefSummary"
              value={formik.values.BriefSummary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className={`block rounded-lg p-2.5 w-full text-sm text-gray-900 bg-gray-100 outline-none ${
                formik.touched.BriefSummary && formik.errors.BriefSummary
                  ? "border border-red-500"
                  : ""
              }`}
              defaultValue={""}
            />
            {formik.touched.BriefSummary && formik.errors.BriefSummary && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.BriefSummary}
              </div>
            )}
          </div>
          <div className="text-center my-5">
            <button
              type="submit"
              className="text-center w-1/2 bg-[#3B9DD2] px-10 py-1.5 rounded-lg text-white"
              disabled={loading}
            >
              {loading ? (
                <span>جاري التحميل...</span>
              ) : isEdit ? (
                "تحديث"
              ) : (
                "حفظ"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
