import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export default function Offers({ requestId, changeOffers }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noOffers, setNoOffers] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  function getOfferById(serviceId) {
    setLoading(true);
    setNoOffers(false);
    axios
      .get(
        `https://skilly.runasp.net/api/OfferSalary/getAllOffersBy/${serviceId}`
      )
      .then((response) => {
        setOffers(response.data.offers);
        setLoading(false);
      })
      .catch((error) => {
        console.log("API error:", error);
        if (error.response && error.response.status === 404) {
          setNoOffers(true);
        }
        setLoading(false);
      });
  }

  const handleAcceptOffer = async (offerId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [offerId]: "accept" }));
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("يجب تسجيل الدخول لقبول العرض");
        setActionLoading((prev) => ({ ...prev, [offerId]: null }));
        return;
      }

      await axios.post(
        `https://skilly.runasp.net/api/OfferSalary/AcceptOffer/${offerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (changeOffers) changeOffers(offers.length - 1);
      toast.success("تم قبول العرض بنجاح");
      getOfferById(requestId);
    } catch (err) {
      console.error("Error accepting offer:", err);
      toast.error("حدث خطأ أثناء قبول العرض");
    } finally {
      setActionLoading((prev) => ({ ...prev, [offerId]: null }));
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [offerId]: "reject" }));
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("يجب تسجيل الدخول لرفض العرض");
        setActionLoading((prev) => ({ ...prev, [offerId]: null }));
        return;
      }

      await axios.post(
        `https://skilly.runasp.net/api/OfferSalary/RejectOffer/${offerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (changeOffers) changeOffers(offers.length - 1);
      toast.success("تم رفض العرض بنجاح");
      getOfferById(requestId);
    } catch (err) {
      console.error("Error rejecting offer:", err);
      toast.error("حدث خطأ أثناء رفض العرض");
    } finally {
      setActionLoading((prev) => ({ ...prev, [offerId]: null }));
    }
  };

  useEffect(() => {
    getOfferById(requestId);
  }, [requestId]);

  return (
    <div className="w-full max-w-full sm:container px-2 sm:px-4 mx-auto">
      <div
        className="bg-white w-full max-w-xl mx-auto rounded-xl shadow-md"
        dir="rtl"
      >
        <div className="bg-[#27AAE1] text-white p-3 md:p-5 text-center rounded-t-xl font-bold text-lg sm:text-xl md:text-2xl">
          العروض
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8 sm:py-10 px-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-t-2 border-[#27AAE1]"></div>
          </div>
        )}

        {!loading && noOffers && (
          <div className="text-center py-8 sm:py-10 px-4 text-[#23255B] text-sm sm:text-base">
            لا يوجد عروض متاحة لهذه الخدمة
          </div>
        )}

        {!loading && !noOffers && offers.length > 0 && (
          <div className="p-2 sm:p-3 md:p-4 lg:p-5 space-y-3 sm:space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-[#F6F7F9] rounded-xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={offer.userImg || "https://via.placeholder.com/48"}
                      className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover border border-gray-200"
                      alt={offer.userName}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48";
                      }}
                    />
                    <h5 className="text-[#23255B] font-bold text-sm sm:text-base">
                      {offer.userName}
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-black bg-gray-100 px-2 py-1 sm:px-3 rounded-full inline-block">
                    التسليم خلال {offer.deliverytime}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-2 sm:p-3 my-3 shadow-sm">
                  <p className="text-[#23255B] text-xs sm:text-sm md:text-base font-semibold">
                    {offer.notes}
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleAcceptOffer(offer.id)}
                      disabled={actionLoading[offer.id]}
                      className="bg-[#27AAE1] text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg w-[48%] sm:w-auto flex items-center justify-center text-sm sm:text-base hover:bg-[#1f97c9] transition-colors duration-200"
                    >
                      {actionLoading[offer.id] === "accept" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        "قبول"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectOffer(offer.id)}
                      disabled={actionLoading[offer.id]}
                      className="bg-[#23255B] text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg w-[48%] sm:w-auto flex items-center justify-center text-sm sm:text-base hover:bg-[#1a1c43] transition-colors duration-200"
                    >
                      {actionLoading[offer.id] === "reject" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        "رفض"
                      )}
                    </button>
                  </div>
                  <div className="bg-[#e6f4f9] text-[#27AAE1] font-bold text-center sm:text-right px-3 py-1 rounded-lg">
                    {offer.salary} ج.م
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Offers.propTypes = {
  requestId: PropTypes.string.isRequired,
};
