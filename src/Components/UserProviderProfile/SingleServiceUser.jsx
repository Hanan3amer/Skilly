import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import { useUserType } from "../../utils/hooks/useUserType";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Buyservice from "../Buyservice/Buyservice";
import OfferPrice from "../OfferPrice/OfferPrice";
function SingleService() {
  const userType = useUserType();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgsLength, setImgsLength] = useState(0);
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const isCurrentWork = queryParams.get("isCurrentWork") === "true";
  const isRequest = queryParams.get("isRequest") === "true";

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          setError("يرجى تسجيل الدخول أولاً");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://skilly.runasp.net/api/UserProfile/requestServices/GetRequestsBy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.service) {
          response.data.service.images = response.data.service.images.map(
            (image) => image?.img
          );
          setImgsLength(response.data.service.images.length);
          const serviceData = response.data.service;
          setService(serviceData);
          console.log("Request data loaded:", serviceData);
          setLoading(false);
        } else {
          setError("لم يتم العثور على الطلب");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("فشل في تحميل بيانات الطلب");
        setLoading(false);
      }
    };
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
          `https://skilly.runasp.net/api/Provider/ProviderServices/GetServiceBy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.service) {
          response.data.service.images = response.data.service.images.map(
            (image) => image?.img
          );
          setService(response.data.service);
          setImgsLength(response.data.service.images.length);
          console.log("Service data loaded:", response.data.service);
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
    if (isRequest) {
      fetchRequestData();
    } else {
      fetchServiceData();
    }
  }, [id, isRequest]);

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

  useEffect(() => {
    if (imgsLength === 0) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev === imgsLength - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [imgsLength]);

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
      <ToastContainer className="text-center mx-auto" />
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[#00000047] bg-opacity-50 z-50 flex items-center justify-center p-4">
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

      <article className="p-5 w-full bg-white dark:bg-gray-700 rounded-xl border max-w-[1000px] shadow-md">
        <h1 className="mb-6 text-xl font-bold text-sky-500 text-center">
          {service.name}
        </h1>

        <div className="relative mb-4">
          {service.images && service.images.length > 0 ? (
            <div>
              <img
                src={service.images[activeImageIndex]}
                alt={service.name}
                className="w-full h-auto rounded-lg object-cover aspect-[2/1]"
              />

              {service.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {service.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === activeImageIndex ? "bg-sky-500" : "bg-sky-200"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-600 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">لا توجد صور</p>
            </div>
          )}
        </div>

        {!isRequest && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
              وصف الخدمة
            </h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
              <p className="text-black dark:text-white text-right">
                {service.description}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
              سعر الخدمة
            </h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
              <p className="text-black dark:text-white text-right">
                {service.price} ج.م
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
              مدة التسليم
            </h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
              <p className="text-black dark:text-white text-right">
                {service.deliverytime}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
            ملاحظات
          </h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <p className="text-black dark:text-white text-right">
              {service.notes || "لا توجد ملاحظات"}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-black dark:text-white text-right mb-2">
          الفيديو
        </h2>
        {service.video ? (
          <div className="relative">
            <video
              src={service.video}
              controls
              className="w-full rounded-lg max-h-[400px]"
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
        <div className="flex gap-4 my-3 items-center justify-center">
          <button
            onClick={() => setModal(true)}
            className="text-sm bg-[#27AAE1] text-white px-5 py-1 text-center rounded-lg"
          >
            شراء الخدمة
          </button>
          <button
            onClick={() => setOpen(true)}
            className="text-sm bg-[#27AAE1] text-white px-5 text-center py-1 rounded-lg"
          >
            عرض السعر
          </button>
        </div>
      </article>
       {modal && (
              <div
                onClick={() => setModal(false)}
                className="overlay fixed left-0 right-0 bg-[#00000050] backdrop-blur-[1px] z-5 h-lvh"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute w-1/2 left-1/2 top-1/2"
                >
                  <Buyservice
                    price={service.price}
                    deliveryTime={service.deliverytime}
                    serviceID={service.id}
                  />
                </div>
              </div>
            )}
      
            {open && (
              <div
                onClick={() => setOpen(false)}
                className="overlay fixed top-0 left-0 right-0 bottom-0 bg-[#00000050] backdrop-blur-[1px] z-5"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute w-1/2 left-1/2 top-1/2"
                >
                  <OfferPrice serviceID={service.id} onClose={() => setOpen(false)} />
                </div>
              </div>
            )}
    </main>
  );
}

export default SingleService;
