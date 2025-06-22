import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";
import { useUserType } from "../../utils/hooks/useUserType";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SingleGallery() {
  const userType = useUserType();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [completingService, setCompletingService] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const isCurrentWork = queryParams.get("isCurrentWork") === "true";

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          setError("You must be logged in to view this service");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://skilly.runasp.net/api/Provider/Servicegallery/GetGalleryBy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.gallery) {
          setService(response.data.gallery);
          console.log("Service data loaded:", response.data.gallery);
        } else {
          setError("Service not found");
        }
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  const handleBack = () => {
    const url = userType === 0 ? `/userprofile/${id}` : "/serviceprovider";
    navigate(url);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      const token = localStorage.getItem("userToken");

      if (!token) {
        setDeleteError("You must be logged in to delete this service");
        setDeleteLoading(false);
        return;
      }

      const response = await axios.delete(
        `https://skilly.runasp.net/api/Provider/ProviderServices/DeleteServiceBy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response);

      toast.success("تم حذف الخدمة بنجاح");
      navigate("/serviceprovider");
    } catch (err) {
      console.error("Error deleting service:", err);
      setDeleteError("Failed to delete service. Please try again.");
      setDeleteLoading(false);
    }
  };

  const handleImageNavigate = (direction) => {
    if (!service || !service.images || service.images.length === 0) return;

    if (direction === "next") {
      setActiveImageIndex((prev) =>
        prev === service.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setActiveImageIndex((prev) =>
        prev === 0 ? service.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ToastContainer className="text-center mx-auto" />
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={handleBack}
          className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!service) {
    return <Loading />;
  }

  return (
    <main className="flex flex-col items-center p-3 w-full bg-white dark:bg-gray-800">
      <ToastContainer />
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-right text-red-600 mb-4">
              تأكيد الحذف
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-right mb-6">
              هل أنت متأكد من رغبتك في حذف هذه الخدمة؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>

            {deleteError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{deleteError}</span>
              </div>
            )}

            <div className="flex justify-start gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
                disabled={deleteLoading}
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading && (
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
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sky-500 text-lg font-bold text-right mb-4">
        معرض الأعمال
      </div>
      <article className="p-5 w-full bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 max-w-[1000px] shadow-md">
        <h1 className="text-xl font-bold text-black dark:text-white text-center mb-6">
          {service.galleryName}
        </h1>

        {/* Details Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
            تفاصيل غرفة المعيشة
          </h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <p className="text-sm text-black dark:text-white text-right">
              {service.description}
            </p>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
            مدة التسليم
          </h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <p className="text-black dark:text-white text-right">
              {service.deliverytime}
            </p>
          </div>
        </div>

        {/* Images Gallery */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
            الصور
          </h2>
          {service.images && service.images.length > 0 ? (
            <div className="relative">
              {service.images.length > 0 && (
                <div className="mt-2">
                  <img
                    src={service.images[activeImageIndex].img}
                    alt="الصورة المختارة"
                    className="w-full h-auto max-h-96 object-cover rounded-lg"
                  />
                  {service.images.length > 1 && (
                    <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between">
                      <button
                        onClick={() => handleImageNavigate("prev")}
                        className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleImageNavigate("next")}
                        className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">لا توجد صور</p>
            </div>
          )}
        </div>

        {/* Video Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
            الفيديو
          </h2>
          {service.video ? (
            <div className="relative">
              <video
                src={service.video}
                controls
                className="w-full rounded-lg"
              />
              {!service.video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">لا يوجد فيديو</p>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

export default SingleGallery;
