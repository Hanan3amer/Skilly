import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const OffersModal = ({ isOpen, onClose, serviceId }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingOffers, setProcessingOffers] = useState({});

  useEffect(() => {
    if (!isOpen || !serviceId) return;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`https://skilly.runasp.net/api/OfferSalary/getAllOffersBy/${serviceId}`);

        setOffers([
          {
            id: "0bac726c-4604-4ac8-b107-4f1faeadef89",
            userId: "ab95ed26-0380-4c30-9cc8-5424e7e7bf94",
            userName: "حنان عامر",
            userImg: "https://skilly.runasp.net/Images/UserProfile/userpic.jpg",
            salary: 1000,
            deliverytime: "3 ايام",
            notes: "سيتم تسليمك الخدمة في اأسرع وقت وبأفضل جوده",
            serviceId: "022156eb-f7f1-4b67-8784-57861ac3999a",
            serviceName: "خدمة توصيل",
            status: null,
          },
          {
            id: "e32bcb85-3d5d-40e8-b810-fe13ba7ef801",
            userId: "ab95ed26-0380-4c30-9cc8-5424e7e7bf94",
            userName: "حنان عامر",
            userImg: "https://skilly.runasp.net/Images/UserProfile/userpic.jpg",
            salary: 1000,
            deliverytime: "3 ايام",
            notes: "سيتم تسليمك الخدمة في اأسرع وقت وبأفضل جوده",
            serviceId: "022156eb-f7f1-4b67-8784-57861ac3999a",
            serviceName: "خدمة توصيل",
            status: null,
          },
        ]);
        // if (response.data && response.data.offers) {
        // } else {
        //   setOffers([]);
        // }
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError("فشل في تحميل العروض");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [isOpen, serviceId]);

  const handleAcceptOffer = async (offerId) => {
    // In a real implementation, you would call an API endpoint to accept the offer
    // This is a placeholder for demonstration
    try {
      setProcessingOffers((prev) => ({ ...prev, [offerId]: "accepting" }));

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update UI after success
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: "accepted" } : offer
        )
      );
    } catch (err) {
      console.error("Error accepting offer:", err);
    } finally {
      setProcessingOffers((prev) => ({ ...prev, [offerId]: null }));
    }
  };

  const handleRejectOffer = async (offerId) => {
    // In a real implementation, you would call an API endpoint to reject the offer
    // This is a placeholder for demonstration
    try {
      setProcessingOffers((prev) => ({ ...prev, [offerId]: "rejecting" }));

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update UI after success
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: "rejected" } : offer
        )
      );
    } catch (err) {
      console.error("Error rejecting offer:", err);
    } finally {
      setProcessingOffers((prev) => ({ ...prev, [offerId]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white  rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-sky-500 text-white py-4 px-6">
          <h2 className="text-2xl font-bold text-center">العروض</h2>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200 transition-colors"
          aria-label="Close"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-6">{error}</div>
          ) : offers.length === 0 ? (
            <div className="text-center text-gray-500  py-6">
              لا توجد عروض متاحة
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`border rounded-lg p-4 ${
                    offer.status === "accepted"
                      ? "border-green-500 bg-green-50 "
                      : offer.status === "rejected"
                      ? "border-red-500 bg-red-50 "
                      : "border-gray-200  bg-gray-50 "
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.userImg}
                        alt={offer.userName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://skilly.runasp.net/Images/UserProfile/userpic.jpg";
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-gray-800 ">
                          {offer.userName}
                        </h3>
                        <p className="text-sm text-gray-500 ">
                          {offer.deliverytime}
                        </p>
                      </div>
                    </div>
                    <div className="text-sky-500 font-bold text-lg">
                      {offer.salary} ج.م
                    </div>
                  </div>

                  <p className="text-gray-700  text-right">{offer.notes}</p>

                  {offer.status === "accepted" ? (
                    <div className="mt-3 text-green-600 font-bold text-center">
                      تم قبول العرض
                    </div>
                  ) : offer.status === "rejected" ? (
                    <div className="mt-3 text-red-600 font-bold text-center">
                      تم رفض العرض
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={() => handleRejectOffer(offer.id)}
                        disabled={processingOffers[offer.id]}
                      >
                        {processingOffers[offer.id] === "rejecting" && (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        )}
                        رفض
                      </button>
                      <button
                        className="px-4 py-2 bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={() => handleAcceptOffer(offer.id)}
                        disabled={processingOffers[offer.id]}
                      >
                        {processingOffers[offer.id] === "accepting" && (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        )}
                        قبول
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OffersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  serviceId: PropTypes.string,
};

export default OffersModal;
