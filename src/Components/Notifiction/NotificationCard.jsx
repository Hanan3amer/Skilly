import { useState, useRef } from "react";
import DeleteButton from "./DeleteButton";
import PropTypes from "prop-types";
import OfferPrice from "../OfferPrice/OfferPrice";
import axios from "axios";
import Reviews from "../Reviews/Reviews";
const NotificationCard = ({
  id,
  title,
  content,
  onDelete,
  offerId,
  onViewOffer,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const token = localStorage.getItem("userToken");
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const goPayment = async () => {
    try {
      const res = await axios.post(
        "https://skilly.runasp.net/api/Payment/start-payment",
        { serviceId: offerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        window.location.href = res.data.result.iframeUrl;
      }
    } catch (error) {
      console.error("فشل بدء عملية الدفع:", error);
    }
  };
  return (
    <>
      <div
        className="relative border flex overflow-hidden rounded-xl hover:shadow-md transition-all duration-200 h-25"
        style={{ minHeight: "50px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute h-full right-0 top-0 flex items-center transform transition-transform duration-300 ease-in-out z-10 ${
            isHovered ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ width: "60px" }}
        >
          <DeleteButton onClick={handleDelete} />
        </div>

        <div
          className={`flex-grow p-4 bg-white transition-all duration-300 ease-in-out ${
            isHovered ? "pr-[70px]" : "pr-4"
          }`}
        >
          <h3 className="text-lg font-bold text-right text-black mb-2">
            {title}
          </h3>
          <p className="text-xs text-right text-gray-700">{content}</p>

          {title === "عرض سعر جديد" && onViewOffer && offerId && (
            <button
              className="mt-2 bg-[#27AAE1] text-white text-sm px-4 py-2 rounded-xl"
              onClick={() => onViewOffer(offerId)}
            >
              مشاهدة العرض
            </button>
          )}

          {title === "رفض عرض السعر" && offerId && (
            <>
              <button
                className="mt-2 bg-[#27AAE1] text-white text-sm px-4 py-2 rounded-xl"
                onClick={openModal}
              >
                عرض سعر
              </button>
            </>
          )}
          {title === "قبول خدمة" && (
            <>
              <button
                onClick={goPayment}
                className="mt-2 bg-[#27AAE1] text-white text-sm px-4 py-2 rounded-xl"
              >
                اذهب للدفع
              </button>
            </>
          )}
          {title === "قبول عرض سعر" && (
            <>
              <button
                onClick={goPayment}
                className="mt-2 bg-[#27AAE1] text-white text-sm px-4 py-2 rounded-xl"
              >
                اذهب للدفع
              </button>
            </>
          )}
          {title === "تم تنفيذ الخدمة" && (
            <button
              onClick={openReviewModal}
              className="mt-2 bg-[#27AAE1] text-white text-sm px-4 py-2 rounded-xl"
            >
              تأكيد استلام
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div ref={modalRef}>
            <OfferPrice serviceID={offerId} onClose={closeModal} />
          </div>
        </div>
      )}
      {isReviewModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              closeReviewModal();
            }
          }}
        >
          <div ref={modalRef}>
            <Reviews serviceID={offerId} onClose={closeReviewModal} />
          </div>
        </div>
      )}
    </>
  );
};

NotificationCard.propTypes = {
  onDelete: PropTypes.func,
  id: PropTypes.any,
  title: PropTypes.any,
  content: PropTypes.any,
  offerId: PropTypes.any,
  onViewOffer: PropTypes.func,
};

export default NotificationCard;
