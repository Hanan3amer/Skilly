import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
// import Winner from "../../Components/winner/Winner";
const RequestService = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://skilly.runasp.net/api/Category/getAllCategories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSubmitError("Failed to load categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [token]);

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required("Service name is required")
      .max(100, "Name is too long"),
    Price: Yup.string().required("Price is required"),
    Deliverytime: Yup.string().required("Delivery time is required"),
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    categoryId: Yup.string().required("Category is required"),
    Notes: Yup.string().max(500, "Notes are too long"),
  });

  const formik = useFormik({
    initialValues: {
      Name: "",
      Price: "",
      Deliverytime: "",
      startDate: "",
      categoryId: "",
      Notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData();

        // Add form values
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        // Add images
        imageFiles.forEach((img) => {
          formData.append("Images", img.file);
        });

        // Add video if exists
        if (videoFile) {
          formData.append("Video", videoFile.file);
        }

        const response = await axios.post(
          "https://skilly.runasp.net/api/UserProfile/requestServices/AddrequestService",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            },
          }
        );

        console.log("Request successful:", response.data);
        navigate("/userprofile");
        // setShowSuccessPopup(true);
        formik.resetForm();
        setImageFiles([]);
        setVideoFile(null);
      } catch (error) {
        console.error("Request failed:", error);
        setSubmitError(
          error.response?.data?.message ||
            error.response?.data ||
            "An error occurred while submitting your request"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image"));

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    const validFiles = imageFiles.filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      setSubmitError("Some images exceed the maximum size limit (10MB)");
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFiles((prevFiles) => [
          ...prevFiles,
          {
            file,
            preview: e.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("video")) {
      setSubmitError("Please select a video file only");
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setSubmitError("Video exceeds maximum size limit (50MB)");
      return;
    }

    // Clean up previous video if exists
    if (videoFile?.preview) {
      URL.revokeObjectURL(videoFile.preview);
    }

    // Create video preview
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      setVideoFile({
        file,
        preview: URL.createObjectURL(file),
        duration: video.duration,
      });
    };

    video.src = URL.createObjectURL(file);
  };

  const removeImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    if (videoFile?.preview) {
      URL.revokeObjectURL(videoFile.preview);
    }
    setVideoFile(null);
  };

  // Clean up video preview when component unmounts
  useEffect(() => {
    return () => {
      if (videoFile?.preview) {
        URL.revokeObjectURL(videoFile.preview);
      }
    };
  }, [videoFile]);

  return (
    <div className="container">
      <h1 className="text-[#27AAE1] text-center font-bold text-2xl my-5">
        طلب خدمة جديدة
      </h1>
      {loadingCategories ? (
        <div className="loading-message">Loading Form...</div>
      ) : (
        <div className="border-2 p-5 rounded-lg border-gray-500 max-w-lg mx-auto bg-gray-200 my-5">
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-sm mx-auto"
            dir="rtl"
          >
            <div className="mb-5">
              <label
                className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                htmlFor="Name"
              >
                عنوان الخدمه
              </label>
              <input
                id="Name"
                name="Name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Name}
                placeholder="عمل غرفة معيشة"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {formik.touched.Name && formik.errors.Name ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.Name}
                </div>
              ) : null}
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative w-full mb-5 group">
                <label
                  htmlFor="base-input"
                  className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                >
                  السعر
                </label>
                <input
                  placeholder="1200"
                  id="Price"
                  name="Price"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.Price}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {formik.errors.Price && formik.touched.Price && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.Price}
                  </div>
                )}
              </div>
              <div className="relative w-full mb-5 group">
                <label
                  htmlFor="base-input"
                  className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                >
                  مدة التسليم
                </label>
                <input
                  placeholder="20"
                  type="text"
                  name="Deliverytime"
                  value={formik.values.Deliverytime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="base-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {formik.errors.Deliverytime && formik.touched.Deliverytime && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.Deliverytime}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="startDate"
                className="font-bold block mb-2 text-sm text-gray-900"
              >
                تاريخ البدأ
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
                min={new Date().toISOString().split("T")[0]}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {formik.touched.startDate && formik.errors.startDate ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.startDate}
                </div>
              ) : null}
            </div>
            <div className="mb-5">
              <label
                htmlFor="categoryId"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                القسم
              </label>
              <select
                id="categoryId"
                name="categoryId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.categoryId}
                disabled={categories.length === 0}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">اختر القسم</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.categoryId}
                </div>
              ) : null}
              {categories.length === 0 && !loadingCategories && (
                <div className="text-red-500 text-sm mt-1">
                  No categories available
                </div>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="Notes"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                الملاحظات
              </label>
              <textarea
                id="Notes"
                name="Notes"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Notes}
                placeholder="اكتب ملاحظاتك هنا...."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                rows={4}
              />
              {formik.touched.Notes && formik.errors.Notes ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.Notes}
                </div>
              ) : null}
            </div>

            {/* Images Upload Section */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-bold text-gray-900">
                إضافة صور (متعدد)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لرفع الصور</span> أو
                      اسحبها هنا
                    </p>
                    <p className="text-xs text-gray-500">
                      الصور فقط (حتى 10MB لكل صورة)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              </div>

              {imageFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    الصور المختارة:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="h-24 w-full rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          disabled={isSubmitting}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="mt-1 text-xs text-gray-500 truncate">
                          {file.file.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload Section (Single Video) */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-bold text-gray-900">
                إضافة فيديو (اختياري - فيديو واحد فقط)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {videoFile ? (
                    <div className="relative w-full h-full">
                      <video
                        src={videoFile.preview}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                        {videoFile.file.name} |{" "}
                        {(videoFile.file.size / (1024 * 1024)).toFixed(2)}MB
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">اضغط لرفع الفيديو</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        فيديو واحد فقط (حتى 50MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              </div>

              {videoFile && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="text-red-600 text-sm font-medium hover:text-red-800"
                  >
                    إزالة الفيديو
                  </button>
                </div>
              )}
            </div>

            {isSubmitting && (
              <div className="mb-5">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#27AAE1] h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  جاري الرفع: {uploadProgress}%
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting || loadingCategories || categories.length === 0
              }
              className="w-full py-2 px-4 bg-[#27AAE1] hover:bg-[#1e8cbb] text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
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
                  جاري الإرسال...
                </div>
              ) : (
                "طلب الخدمة"
              )}
            </button>

            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <strong>خطأ:</strong> {submitError}
              </div>
            )}
          </form>
        </div>
      )}
      {showSuccessPopup && (
        // <Winner onClose={() => setShowSuccessPopup(false)} />
        <></>
      )}
    </div>
  );
};

export default RequestService;
