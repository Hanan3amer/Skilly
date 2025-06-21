import { useState } from "react";
import axios from "axios";

export default function AcceptPrice({ requestId, providerId }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const buyaservice = async () => {
    try {
      const res = await axios.post(
        "https://skilly.runasp.net/api/Payment/start-payment-URL",
        {
          ServiceId: requestId,
          redirectUrl: `${window.location.origin}/paymentsuccesspopup`,
        },
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

  const handleAccept = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://skilly.runasp.net/api/Emergency/accept-offer",
        { requestId, providerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await buyaservice();
    } catch (error) {
      console.error("فشل قبول العرض:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAccept}
      className="bg-sky-500 text-white px-4 py-1 rounded-lg disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "جاري المعالجة..." : "قبول"}
    </button>
  );
}
