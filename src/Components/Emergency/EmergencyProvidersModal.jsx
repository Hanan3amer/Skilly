import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import AcceptPrice from "./AcceptPrice";
import RegectPrice from "./RegectPrice";
export default function EmergencyProvidersModal({
  show,
  onClose,
  providers,
  setProviders,
}) {
  const handleReject = (providerId) => {
    setProviders((prev) => prev.filter((p) => p.id !== providerId));
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg w-full max-w-lg border border-black"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="border p-4 rounded-xl mb-4 bg-gray-200"
                dir="rtl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={provider.imageUrl}
                      className="w-12 h-12 rounded-full"
                      alt="avatar"
                    />
                    <div className="text-right">
                      <p className="font-bold text-[#23255B]">
                        {provider.name}
                      </p>
                      <p className="text-sm text-black">
                        {provider.categoryName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1">
                      <span className="bg-[#FBBC05] rounded-full w-5 h-5 p-3 relative">
                        <FaStar className="text-[#23255B] absolute text-center translate-x-1/2 -translate-y-1/2" />
                      </span>
                      <span>{provider.review}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-right">
                    <p className="text-sm text-black font-bold my-2">
                      وقت الوصول المتوقع
                    </p>
                    <input
                      className=" rounded-xl border text-sm p-1 w-full"
                      disabled
                      value={
                        provider.estimatedTimeFormatted.includes("دقيقة")
                          ? provider.estimatedTimeFormatted.slice(
                              0,
                              provider.estimatedTimeFormatted.indexOf("دقيقة") +
                                "دقيقة".length
                            )
                          : provider.estimatedTimeFormatted
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm text-black font-bold my-2">السعر</p>
                    <input
                      className="disabled rounded-xl border text-sm p-1 w-full"
                      value={`${provider.price} ج.م  `}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <AcceptPrice
                    requestId={provider.requestId}
                    providerId={provider.id}
                    onSuccess={() => {}}
                  />
                  <RegectPrice
                    requestId={provider.requestId}
                    providerId={provider.id}
                    onReject={handleReject}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={onClose}
              className="block mx-auto mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              إغلاق
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
