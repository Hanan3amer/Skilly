import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoUpload from "../VideoUpload/VideoUpload";
import ImageUpload from "../ImageUpload/ImageUpload";
import Loading from "../Loading/Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    notes: "",
    categoryId: "",
    images: [],
    video: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  const [servicesData , setServicesData] = useState({})
  // Fetch service data
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          toast.error("يرجى تسجيل الدخول أولاً");
          navigate("/signin");
          return;
        }

        // Fetch categories first
        try {
          const categoriesResponse = await axios.get(
            "https://skilly.runasp.net/api/Category/getAllCategories"
          );

          if (categoriesResponse.data && categoriesResponse.data.categories) {
            setCategories(categoriesResponse.data.categories);
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }

        // Fetch service details
        const response = await axios.get(
          `https://skilly.runasp.net/api/Provider/ProviderServices/GetServiceBy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.service) {
          const serviceData = response.data.service;
          console.log("Service data loaded:", serviceData);

          // Extract delivery time number from string like "20 يوم"
          let deliveryTime = serviceData.deliverytime || "";
          if (deliveryTime.includes(" ")) {
            deliveryTime = deliveryTime.split(" ")[0];
          }

          // Process images to match the format expected by ImageUpload
          const processedImages = (serviceData.images?.map(image => {
            setServicesData((servicesData) => ({...servicesData, [image?.img]: image?.id}))
           return image?.img
          }) || []).map(
            (url, index) => ({
              url: url,
              alt: `Image ${index + 1}`,
              file: null,
            })
          );

          setFormData({
            title: serviceData.name || "",
            description: serviceData.description || "",
            price: serviceData.price ? serviceData.price.toString() : "",
            deliveryTime: deliveryTime,
            notes: serviceData.notes || "",
            categoryId: serviceData.categoryId || "",
            images: processedImages,
            video: serviceData.video || null,
          });
        } else {
          toast.error("لم يتم العثور على الخدمة");
          navigate("/serviceprovider");
        }
      } catch (err) {
        console.error("Error fetching service details:", err);
        toast.error("فشل في تحميل بيانات الخدمة");
        navigate("/serviceprovider");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageUpdate = (newImages) => {
    setFormData((prevData) => ({
      ...prevData,
      images: newImages,
    }));
  };

  const handleVideoUpdate = (videoFile) => {
    setFormData((prevData) => ({
      ...prevData,
      video: videoFile,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "يرجى إدخال عنوان الخدمة";
    }

    if (!formData.description.trim()) {
      newErrors.description = "يرجى إدخال وصف الخدمة";
    }

    if (!formData.price.trim()) {
      newErrors.price = "يرجى إدخال السعر";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "السعر يجب أن يكون رقماً موجباً";
    }

    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = "يرجى إدخال مدة التسليم";
    } else if (
      isNaN(formData.deliveryTime) ||
      Number(formData.deliveryTime) <= 0
    ) {
      newErrors.deliveryTime = "مدة التسليم يجب أن تكون رقماً موجباً";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "يرجى اختيار التصنيف";
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "يرجى إضافة صورة واحدة على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteImage = (url) => {
    console.log(url);
    console.log(servicesData)
    setDeletedImages((prev) => [...prev, servicesData[url]]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setSubmitting(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          toast.error("يرجى تسجيل الدخول أولاً");
          navigate("/signin");
          return;
        }

        // Create FormData object for the API
        const apiFormData = new FormData();
        apiFormData.append("Name", formData.title);
        apiFormData.append("Description", formData.description);
        apiFormData.append("Deliverytime", formData.deliveryTime + " يوم");
        apiFormData.append("Notes", formData.notes || "");
        apiFormData.append("Price", formData.price);
        apiFormData.append("categoryId", formData.categoryId);

        // Add images - only add new file uploads
        formData.images.forEach((image) => {
          if (image.file) {
            apiFormData.append("Images", image.file);
          }
        });
        console.log(deletedImages)
        deletedImages.forEach((image) => {
          apiFormData.append("ImagesToDeleteIds", image);
        });

        // Add video if it's a new file
        if (formData.video && formData.video.file) {
          apiFormData.append("Video", formData.video.file);
        }

        // Send request to API
        const response = await axios.put(
          `https://skilly.runasp.net/api/Provider/ProviderServices/EditServiceBy/${id}`,
          apiFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("تم تحديث الخدمة بنجاح!");
          setTimeout(() => {
            navigate(`/service/${id}`);
          }, 1500);
        } else {
          toast.error("حدث خطأ أثناء تحديث الخدمة");
        }
      } catch (error) {
        console.error("Error updating service:", error);
        toast.error(
          error.response?.data?.message ||
            "حدث خطأ أثناء تحديث الخدمة، يرجى المحاولة مرة أخرى"
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
    }
  };

  const handleBack = () => {
    navigate(`/service/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="flex flex-col items-center p-3 w-full bg-white dark:bg-gray-800">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        rtl={true}
        theme="colored"
      />
      <div className="w-full max-w-[1000px] mb-2 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>العودة</span>
        </button>
        <h1 className="text-2xl font-bold text-sky-500 dark:text-sky-400">
          تعديل الخدمة
        </h1>
      </div>
      <article className="p-5 w-full bg-gray-100 dark:bg-gray-700 rounded-xl border border-black dark:border-gray-600 max-w-[1000px] shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col items-end">
          <div className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
              عنوان الخدمه
            </h2>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عمل غرفة معيشة"
              className={`p-4 w-full text-lg text-right text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                errors.title
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600"
              }`}
              dir="rtl"
            />
            {errors.title && (
              <p className="text-red-500 text-right mt-1">{errors.title}</p>
            )}
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
                وصف الخدمه
              </h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="تصميم بسيط ومريح يجمع بين الأناقة والعملية، مع ألوان متناغمة..."
                className={`p-4 w-full text-lg text-right text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg min-h-[100px] focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                  errors.description
                    ? "border border-red-500"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
                dir="rtl"
              />
              {errors.description && (
                <p className="text-red-500 text-right mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
                مدة التسليم
              </h2>
              <div
                className={`flex justify-between items-center p-4 w-full bg-white dark:bg-gray-800 rounded-lg ${
                  errors.deliveryTime
                    ? "border border-red-500"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
              >
                <span className="text-lg font-bold text-sky-500 dark:text-sky-400">
                  يوم
                </span>
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  placeholder="20"
                  className={`w-full text-lg text-right text-black dark:text-white bg-transparent focus:outline-none ${
                    errors.deliveryTime ? "text-red-500" : ""
                  }`}
                />
              </div>
              {errors.deliveryTime && (
                <p className="text-red-500 text-right mt-1">
                  {errors.deliveryTime}
                </p>
              )}
            </div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
                السعر
              </h2>
              <div
                className={`flex justify-between items-center p-4 w-full bg-white dark:bg-gray-800 rounded-lg ${
                  errors.price
                    ? "border border-red-500"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
              >
                <span className="text-lg font-bold text-sky-500 dark:text-sky-400">
                  ج.م
                </span>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1200"
                  className={`w-full text-lg text-right text-black dark:text-white bg-transparent focus:outline-none ${
                    errors.price ? "text-red-500" : ""
                  }`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-right mt-1">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
              التصنيف
            </h2>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`p-4 w-full text-lg text-right text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                errors.categoryId
                  ? "border border-red-500"
                  : "border border-gray-300 dark:border-gray-600"
              }`}
              dir="rtl"
            >
              <option value="">-- اختر التصنيف --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-right mt-1">
                {errors.categoryId}
              </p>
            )}
          </div>
          <div className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
              الملاحظات
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="1- يمكن استخدام أجود أنواع الخشب الطبيعي أو المعالج. 2- تلبية جميع الأنماط..."
              className="p-4 w-full text-lg text-right text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg min-h-[80px] focus:outline-none focus:ring-1 focus:ring-sky-300 border border-gray-300 dark:border-gray-600"
              dir="rtl"
            />
          </div>
          <section className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
              الصور
            </h2>
            <ImageUpload
              onImagesUpdate={handleImageUpdate}
              initialImages={formData.images}
              onDeleteImage={handleDeleteImage}
            />
            {errors.images && (
              <p className="text-red-500 text-right mt-1">{errors.images}</p>
            )}
          </section>
          <section className="w-full mb-5">
            <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
              الفيديو
            </h2>
            <VideoUpload
              onVideoUpdate={handleVideoUpdate}
              initialVideo={formData.video}
            />
          </section>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`text-xl font-bold text-white ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 cursor-pointer"
              } rounded-lg py-2 px-6 transition-colors flex items-center`}
            >
              {submitting && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </article>
    </main>
  );
};

export default ServiceEditForm;
