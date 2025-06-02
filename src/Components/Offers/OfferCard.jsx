import PropTypes from "prop-types";
import { ToastContainer, Bounce } from "react-toastify";

export default function OfferCard({
  offer,
  onAccept,
  onReject,
  loadingAction,
}) {
  return (
    <>
      <ToastContainer rtl theme="light" transition={Bounce} />
      <div className="bg-[#F6F7F9] rounded-xl my-5 p-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center justify-between gap-5">
            <img
              src={offer.userImg || "https://via.placeholder.com/48"}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48";
              }}
              alt="User"
              className="w-12 rounded-full h-12"
            />
            <h5 className="text-[#23255B] font-bold text-sm">
              {offer.userName}
            </h5>
          </div>
          <p className="text-xs text-black">
            التسليم خلال {offer.deliverytime}
          </p>
        </div>

        <p className="text-[#23255B] text-xs font-semibold my-5">
          {offer.notes}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={onAccept}
              disabled={loadingAction === "accept"}
              className="bg-[#27AAE1] text-white px-10 py-0.5 rounded-lg"
            >
              {loadingAction === "accept" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "قبول"
              )}
            </button>
            <button
              onClick={onReject}
              disabled={loadingAction === "reject"}
              className="bg-[#23255B] text-white py-0.5 px-10 rounded-lg"
            >
              {loadingAction === "reject" ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "رفض"
              )}
            </button>
          </div>
          <h5 className="text-[#27AAE1] font-bold">{offer.salary} ج.م</h5>
        </div>
      </div>
    </>
  );
}

OfferCard.propTypes = {
  offer: PropTypes.object.isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  loadingAction: PropTypes.string,
};
