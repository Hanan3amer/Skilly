import { useContext, useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useFormik } from "formik";
import { UserContext } from "../../Context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Location from "../LocationModal/Location";

export default function User() {
  const { addUser, userData, refreshUserData } = useContext(UserContext);
  console.log("User Data:", userData);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEdit = queryParams.get("isEdit") === "true";

  const [activeOption, setActiveOption] = useState("male");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleOptionChange(option) {
    setActiveOption(option);
    formik.setFieldValue("Gender", option === "male" ? "1" : "0");
  }

  useEffect(() => {
    if (isEdit && userData) {
      formik.setValues({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
        Gender: userData.gender === "0" ? "0" : "1",
        City: userData.city || "",
        StreetName: userData.streetName || "",
        Governorate: userData.governorate || "",
      });

      setUserinfo({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
      });

      if (userData.gender == "0") {
        setActiveOption("male");
      } else {
        setActiveOption("female");
      }

      if (userData.img) {
        setPreviewImage(userData.img);
      }
    }
  }, [isEdit, userData]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  }

  const [userinfo, setUserinfo] = useState(
    JSON.parse(localStorage.getItem("formData"))
  );

  async function editUserProfile(values) {
    setLoading(true);
    const formData = new FormData();

    formData.append("Gender", values.Gender);
    formData.append("City", values.City);
    formData.append("StreetName", values.StreetName);
    formData.append("Governorate", values.Governorate);

    if (selectedFile) {
      formData.append("Img", selectedFile);
    }

    try {
      const response = await axios.put(
        "https://skilly.runasp.net/api/UserProfile/UserProfile/editUserProfile",
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
        await refreshUserData();
        navigate("/userprofile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setLoading(false);
    }
  }

  async function addUserProfile(values) {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    if (selectedFile) {
      formData.append("Img", selectedFile);
    }

    const response = await addUser(formData);
    if (response.status === 200) {
      navigate(`/signin`);
    }
  }

  const validationSchema = Yup.object({
    City: Yup.string().required("هذا الحقل مطلوب"),
    StreetName: Yup.string().required("هذا الحقل مطلوب"),
    Governorate: Yup.string().required("هذا الحقل مطلوب"),
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
    },
    validationSchema: isEdit ? validationSchema : null,
    onSubmit: (values) =>
      isEdit ? editUserProfile(values) : addUserProfile(values),
    enableReinitialize: true,
  });

  return (
    <div className="container my-10">
      <Location />
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-xl mx-auto w-full"
        dir="rtl"
      >
        <h1 className="text-center text-[#3B9DD2] font-extrabold text-2xl my-2">
          {isEdit ? "تعديل بيانات المستخدم" : "بيانات المستخدم"}
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
                  value={
                    isEdit && formik.values.firstName
                      ? formik.values.firstName
                      : userinfo?.firstName || ""
                  }
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, firstName: e.target.value })
                  }
                  name="firstName"
                  type="text"
                  id="firstName"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
                  disabled={isEdit}
                />
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={
                    isEdit && formik.values.lastName
                      ? formik.values.lastName
                      : userinfo?.lastName || ""
                  }
                  onChange={(e) =>
                    setUserinfo({ ...userinfo, lastName: e.target.value })
                  }
                  name="lastName"
                  type="text"
                  id="lastName"
                  className="bg-gray-100  text-gray-900 text-sm rounded-lg  focus:border focus:outline-none  focus:border-[#3B9DD2] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#3B9DD2] dark:focus:border-[#3B9DD2] placeholder:text-[#5B5B68]"
                  placeholder=""
                  disabled={isEdit}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  value={
                    isEdit && formik.values.phoneNumber
                      ? formik.values.phoneNumber
                      : userinfo?.phoneNumber || ""
                  }
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
                  value={
                    isEdit && formik.values.email
                      ? formik.values.email
                      : userinfo?.email || ""
                  }
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
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الدقهلية">الدقهلية</option>
                  <option value="الشرقية">الشرقية</option>
                  <option value="القليوبية">القليوبية</option>
                  <option value="كفر الشيخ">كفر الشيخ</option>
                  <option value="الغربية">الغربية</option>
                  <option value="المنوفية">المنوفية</option>
                  <option value="البحيرة">البحيرة</option>
                  <option value="دمياط">دمياط</option>
                  <option value="بورسعيد">بورسعيد</option>
                  <option value="الإسماعيلية">الإسماعيلية</option>
                  <option value="السويس">السويس</option>
                  <option value="شمال سيناء">شمال سيناء</option>
                  <option value="جنوب سيناء">جنوب سيناء</option>
                  <option value="بني سويف">بني سويف</option>
                  <option value="المنيا">المنيا</option>
                  <option value="أسيوط">أسيوط</option>
                  <option value="سوهاج">سوهاج</option>
                  <option value="قنا">قنا</option>
                  <option value="الأقصر">الأقصر</option>
                  <option value="أسوان">أسوان</option>
                  <option value="البحر الأحمر">البحر الأحمر</option>
                  <option value="الوادي الجديد">الوادي الجديد</option>
                  <option value="مطروح">مطروح</option>
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
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="شبرا الخيمة">شبرا الخيمة</option>
                  <option value="6 أكتوبر">6 أكتوبر</option>
                  <option value="الشيخ زايد">الشيخ زايد</option>
                  <option value="العبور">العبور</option>
                  <option value="بدر">بدر</option>
                  <option value="الشروق">الشروق</option>
                  <option value="حلوان">حلوان</option>
                  <option value="المعادي">المعادي</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="دمنهور">دمنهور</option>
                  <option value="كفر الشيخ">كفر الشيخ</option>
                  <option value="طنطا">طنطا</option>
                  <option value="المنصورة">المنصورة</option>
                  <option value="الزقازيق">الزقازيق</option>
                  <option value="بنها">بنها</option>
                  <option value="شبين الكوم">شبين الكوم</option>
                  <option value="دمياط">دمياط</option>
                  <option value="رشيد">رشيد</option>
                  <option value="مرسى مطروح">مرسى مطروح</option>
                  <option value="بورسعيد">بورسعيد</option>
                  <option value="الإسماعيلية">الإسماعيلية</option>
                  <option value="السويس">السويس</option>
                  <option value="العريش">العريش</option>
                  <option value="طور سيناء">طور سيناء</option>
                  <option value="دهب">دهب</option>
                  <option value="شرم الشيخ">شرم الشيخ</option>
                  <option value="نويبع">نويبع</option>
                  <option value="الواحات البحرية">الواحات البحرية</option>
                  <option value="الفرافرة">الفرافرة</option>
                  <option value="الداخلة">الداخلة</option>
                  <option value="الخارجة">الخارجة</option>
                  <option value="حلايب وشلاتين">حلايب وشلاتين</option>
                  <option value="رأس غارب">رأس غارب</option>
                  <option value="الغردقة">الغردقة</option>
                  <option value="مرسى علم">مرسى علم</option>
                  <option value="العاصمة الإدارية الجديدة">
                    العاصمة الإدارية الجديدة
                  </option>
                  <option value="العلمين الجديدة">العلمين الجديدة</option>
                  <option value="أسوان الجديدة">أسوان الجديدة</option>
                  <option value="طيبة الجديدة">طيبة الجديدة</option>
                  <option value="غرب قنا">غرب قنا</option>
                  <option value="شرق بورسعيد">شرق بورسعيد</option>
                  <option value="المنصورة الجديدة">المنصورة الجديدة</option>
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
