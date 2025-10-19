import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import VideoUpload from "../VideoUpload/VideoUpload";
import ImageUpload from "../ImageUpload/ImageUpload";
import axios from "axios";
import { ProviderContext } from "../../Context/ProviderContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceAddForm = () => {
  const navigate = useNavigate();
  const { getProviderServices } = useContext(ProviderContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const queryParams = new URLSearchParams(location.search);
  const isGallary = queryParams.get("isGallary") === "true";

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://skilly.runasp.net/api/Category/getAllCategories"
      );
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = "يرجى إدخال مدة التسليم";
    } else if (
      isNaN(formData.deliveryTime) ||
      Number(formData.deliveryTime) <= 0
    ) {
      newErrors.deliveryTime = "مدة التسليم يجب أن تكون رقماً موجباً";
    }
    if (!isGallary) {
      if (!formData.price.trim()) {
        newErrors.price = "يرجى إدخال السعر";
      } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
        newErrors.price = "السعر يجب أن يكون رقماً موجباً";
      }
      if (!formData.categoryId) {
        newErrors.categoryId = "يرجى اختيار التصنيف";
      }
    }

    if (formData.images.length === 0) {
      newErrors.images = "يرجى إضافة صورة واحدة على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          navigate("/signin");
          return;
        }

        // Create FormData object for the API
        const apiFormData = new FormData();
        apiFormData.append(!isGallary ? "Name" : "galleryName", formData.title);
        apiFormData.append("Description", formData.description);
        apiFormData.append("Deliverytime", formData.deliveryTime + " يوم");
        if (!isGallary) {
          apiFormData.append("Notes", formData.notes || "");
          apiFormData.append("Price", formData.price);
          apiFormData.append("categoryId", formData.categoryId);
        }

        // Add images
        formData.images.forEach((image) => {
          if (image.file) {
            apiFormData.append("Images", image.file);
          }
        });

        // Add video if exists
        if (formData.video) {
          apiFormData.append("Video", formData.video);
        }

        // Send request to API
        const response = await axios.post(
          isGallary
            ? "https://skilly.runasp.net/api/Provider/Servicegallery/AddGallery"
            : "https://skilly.runasp.net/api/Provider/ProviderServices/AddService",
          apiFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          toast.success(
            isGallary ? "تمت إضافة العمل بنجاح!" : "تمت إضافة الخدمة بنجاح!"
          );
          // Refresh services in context
          await getProviderServices();
          navigate("/serviceprovider");
        } else {
          toast.error(
            isGallary
              ? "حدث خطأ أثناء إضافة العمل"
              : "حدث خطأ أثناء إضافة الخدمة"
          );
        }
      } catch (error) {
        console.error("Error adding service:", error);
        toast.error(
          error.response?.data?.message ||
            (isGallary
              ? "حدث خطأ أثناء إضافة العمل"
              : "حدث خطأ أثناء إضافة الخدمة")
        );
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <main className="flex flex-col items-center p-3 w-full bg-white ">
      <ToastContainer className="text-center mx-auto" />
      <div className="w-full max-w-[1000px] mb-2 flex justify-between items-center">
        <Link
          to="/serviceprovider"
          className="flex items-center gap-1 px-3 py-1 text-sky-500 hover:text-sky-600  transition-colors"
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
        </Link>
        <h1 className="text-2xl font-bold text-sky-500 ">
          {isGallary ? "اضافة عمل" : "اضافة خدمة"}
        </h1>
      </div>

      <article className="p-5 w-full bg-gray-100  rounded-xl border border-black  max-w-[1000px] shadow-md">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="w-full mb-4">
              <h2 className="mb-4 text-xl font-bold text-black  text-right">
                {isGallary ? "عنوان العمل" : "عنوان الخدمة"}
              </h2>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`p-4 w-full text-lg text-right text-black  bg-white  rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                  errors.title ? "border-red-500" : "border-none"
                }`}
                dir="rtl"
              />
              {errors.title && (
                <p className="text-red-500 text-right mt-1">{errors.title}</p>
              )}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <h2 className="mb-4 text-xl font-bold text-black  text-right">
                  {isGallary ? "وصف العمل" : "وصف الخدمة"}
                </h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`p-4 w-full text-lg resize-none text-right text-black  bg-white  rounded-lg min-h-[100px] focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                    errors.description ? "border-red-500" : "border-none"
                  }`}
                  dir="rtl"
                />
                {errors.description && (
                  <p className="text-red-500 text-right mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className={`${isGallary ? "md:col-span-2" : ""}`}>
                <h2 className="mb-4 text-xl font-bold text-black  text-right">
                  مدة التسليم
                </h2>
                <div
                  className={`flex justify-between items-center p-4 w-full bg-white  rounded-lg ${
                    errors.deliveryTime ? "border-red-500" : "border-none"
                  }`}
                >
                  <span className="text-lg font-bold text-sky-500 ">يوم</span>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className={`w-full text-lg text-right text-black  bg-transparent focus:outline-none ${
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

              {!isGallary && (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-black  text-right">
                    السعر
                  </h2>
                  <div
                    className={`flex justify-between items-center p-4 w-full bg-white  rounded-lg ${
                      errors.price ? "border-red-500" : "border-none"
                    }`}
                  >
                    <span className="text-lg font-bold text-sky-500 ">ج.م</span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full text-lg text-right text-black  bg-transparent focus:outline-none ${
                        errors.price ? "text-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-right mt-1">
                      {errors.price}
                    </p>
                  )}
                </div>
              )}
            </div>

            {!isGallary && (
              <div className="w-full mb-4">
                <h2 className="mb-4 text-xl font-bold text-black  text-right">
                  التصنيف
                </h2>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`p-4 w-full text-lg text-right text-black  bg-white  rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                    errors.categoryId ? "border-red-500" : "border-none"
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
            )}

            {!isGallary && (
              <div className="w-full mb-4">
                <h2 className="mb-4 text-xl font-bold text-black  text-right">
                  الملاحظات
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="p-4 w-full text-lg resize-none text-right text-black  bg-white  rounded-lg min-h-[80px] focus:outline-none focus:ring-1 focus:ring-sky-300 border-none"
                  dir="rtl"
                />
              </div>
            )}

            <section className="w-full mb-4">
              <h2 className="mb-4 text-xl font-bold text-black  text-right">
                اضافة صور
              </h2>
              <ImageUpload onImagesUpdate={handleImageUpdate} />
              {errors.images && (
                <p className="text-red-500 text-right mt-1">{errors.images}</p>
              )}
            </section>

            <section className="w-full mb-5">
              <h2 className="mb-4 text-xl font-bold text-black  text-right">
                اضافة فيديو
              </h2>
              <VideoUpload onVideoUpdate={handleVideoUpdate} />
            </section>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`text-xl font-bold text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600   cursor-pointer"
                } rounded-lg py-2 px-12 mt-5 transition-colors`}
              >
                {loading
                  ? "جاري الإضافة..."
                  : isGallary
                  ? "اضافة العمل"
                  : "اضافة الخدمة"}
              </button>
            </div>
          </form>
        </div>
      </article>
    </main>
  );
};

export default ServiceAddForm;
