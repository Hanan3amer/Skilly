import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OfferPrice from "../OfferPrice/OfferPrice";
import ImageModal from "../Common/ImageModal";

function SingleRequestService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

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
          const serviceData = response.data.service;
          setRequest(serviceData);
          console.log("Request data loaded:", serviceData);

          // Fetch category data if categoryId exists
          if (serviceData.categoryId) {
            fetchCategoryData(serviceData.categoryId);
          } else {
            setLoading(false);
          }
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

    fetchRequestData();
  }, [id]);

  const fetchCategoryData = async (categoryId) => {
    try {
      const categoryResponse = await axios.get(
        `https://skilly.runasp.net/api/Category/GetCategoryBy/${categoryId}`
      );

      if (categoryResponse.data && categoryResponse.data.category) {
        setCategory(categoryResponse.data.category);
        console.log("Category data loaded:", categoryResponse.data.category);
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/serviceprovider");
  };

  const handleOfferButtonClick = () => {
    setOpen(true);
  };

  const handleAccept = async () => {
    try {
      setAcceptLoading(true);
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً");
        setAcceptLoading(false);
        return;
      }

      const response = await axios.post(
        `https://skilly.runasp.net/api/UserProfile/requestServices/AcceptService/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("تم قبول الطلب بنجاح");
        // Redirect after successful acceptance, you can change this to wherever appropriate
        setTimeout(() => navigate("/serviceprovider"), 2000);
      } else {
        toast.error("حدث خطأ أثناء قبول الطلب");
      }
    } catch (err) {
      console.error("Error accepting service request:", err);
      toast.error(err.response?.data?.message || "فشل في قبول الطلب");
    } finally {
      setAcceptLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ToastContainer position="top-center" rtl={true} theme="colored" />
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-right"
          role="alert"
        >
          <strong className="font-bold">خطأ!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={handleBack}
          className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
        >
          العودة
        </button>
      </div>
    );
  }

  if (!request) {
    return <Loading />;
  }

  // Fallback values to match the image exactly
  const displayData = {
    title: request.name || "عمل خدمة مميزة",
    price: request.price || "1200",
    deliveryTime: request.deliverytime || "٣٠",
    startDate: request.startDate ? request.startDate.split("T")[0] : "3/1/2023",
    category: category?.name || "البنات",
    notes: request.notes,
    images: request.images?.map((image) => image?.img) || [],
    video: request.video,
  };

  return (
    <main className="flex flex-col items-center w-full bg-white min-h-screen py-5">
      <ToastContainer position="top-center" rtl={true} theme="colored" />

      <h1 className="text-2xl font-bold text-sky-500 mb-4">
        تفاصيل الخدمه المطلوبه
      </h1>

      <div className="w-full max-w-[700px] mx-auto p-5 bg-gray-100 rounded-xl border border-gray-200">
        <div className="mb-5">
          <label className="block text-right text-gray-800 text-lg font-bold mb-1">
            عنوان الخدمة
          </label>
          <div className="w-full p-3 border border-gray-300 rounded-lg text-right bg-white">
            {displayData.title}
          </div>
        </div>

        <div className="flex gap-5 mb-5">
          <div className="w-1/2">
            <label className="block text-right text-gray-800 text-lg font-bold mb-1">
              مدة التسليم
            </label>
            <div className="w-full p-3 border border-gray-300 rounded-lg text-right bg-white relative">
              {displayData.deliveryTime}
              <span className="absolute left-2 top-3 text-sky-500">يوم</span>
            </div>
          </div>
          <div className="w-1/2">
            <label className="block text-right text-gray-800 text-lg font-bold mb-1">
              السعر
            </label>
            <div className="w-full p-3 border border-gray-300 rounded-lg text-right bg-white">
              {displayData.price}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-right text-gray-800 text-lg font-bold mb-1">
            تاريخ البدء
          </label>
          <div className="w-full p-3 border border-gray-300 rounded-lg text-right bg-white">
            {displayData.startDate}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-right text-gray-800 text-lg font-bold mb-1">
            القسم
          </label>
          <div className="w-full p-3 border border-gray-300 rounded-lg text-right bg-white">
            {displayData.category}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-right text-gray-800 text-lg font-bold mb-1">
            الملاحظات
          </label>
          <div className="w-full p-3 border border-gray-300 rounded-lg text-right bg-white min-h-[80px] overflow-y-auto">
            {displayData.notes}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-right text-gray-800 text-lg font-bold mb-1">
            الصور
          </label>
          <div className="flex justify-end gap-2">
            {displayData.images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setInitialImageIndex(index);
                  setImageModalOpen(true);
                }}
              >
                <img
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-right text-gray-800 text-lg font-bold mb-1">
            الفيديو
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white h-24 flex items-center justify-center">
            {displayData.video ? (
              <video
                controls
                src={displayData.video}
                className="w-full h-full object-cover max-h-[400px]"
              ></video>
            ) : (
              <p className="text-gray-500 ">لا يوجد فيديو</p>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={handleOfferButtonClick}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg text-base font-bold w-1/2 flex items-center justify-center"
          >
            عرض سعر
          </button>
          <button
            onClick={handleAccept}
            disabled={acceptLoading}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg text-base font-bold w-1/2 flex items-center justify-center"
          >
            {acceptLoading ? (
              <>
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
                جاري القبول...
              </>
            ) : (
              "قبول"
            )}
          </button>
        </div>

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="overlay fixed top-0 left-0 right-0 bottom-0 bg-[#00000050] backdrop-blur-[1px] z-5"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute w-1/2 left-1/2 top-1/2"
            >
              <OfferPrice
                serviceID={request.id}
                onClose={() => {
                  setOpen(false);
                  navigate("/serviceprovider");
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        images={displayData.images}
        initialIndex={initialImageIndex}
      />
    </main>
  );
}

export default SingleRequestService;
