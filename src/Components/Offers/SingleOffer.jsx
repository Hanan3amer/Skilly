import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OfferCard from "./OfferCard";

export default function SingleOffer({ offerId }) {
  const [offer, setOffer] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOffer = () => {
    axios
      .get(`https://skilly.runasp.net/api/OfferSalary/GetOfferBy/${offerId}`)
      .then((response) => {
        setOffer(response.data.offer);
        console.log(response.data.offer);
      })
      .catch((error) => console.error("فشل في جلب العرض:", error));
  };

  useEffect(() => {
    if (offerId) fetchOffer();
  }, [offerId]);

  const goPayment = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.post(
        "https://skilly.runasp.net/api/Payment/start-payment",
        { serviceId: offer.serviceId },
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

  const handleAcceptOffer = async (id) => {
    try {
      setActionLoading("accept");
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("يجب تسجيل الدخول لقبول العرض");
        return;
      }
      await axios
        .post(
          `https://skilly.runasp.net/api/OfferSalary/AcceptOffer/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
        });

      toast.success("تم قبول العرض بنجاح، جاري التحويل لصفحة الدفع...");
      await goPayment();
    } catch (err) {
      console.error("خطأ أثناء قبول العرض:", err);
      toast.error("حدث خطأ أثناء قبول العرض");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectOffer = async (id) => {
    try {
      setActionLoading("reject");
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("يجب تسجيل الدخول لرفض العرض");
        return;
      }

      await axios.post(
        `https://skilly.runasp.net/api/OfferSalary/RejectOffer/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("تم رفض العرض بنجاح");
      fetchOffer();
    } catch (err) {
      console.error("خطأ أثناء رفض العرض:", err);
      toast.error("حدث خطأ أثناء رفض العرض");
    } finally {
      setActionLoading(null);
    }
  };

  if (!offer) {
    return (
      <p className="text-center text-gray-500 mt-4">جاري تحميل العرض...</p>
    );
  }

  return (
    <div className="container" dir="rtl">
      <div className="bg-white max-w-lg mx-auto rounded-xl shadow p-6">
        <div className="bg-[#27AAE1] text-white p-5 text-center rounded-xl font-bold text-2xl">
          تفاصيل العرض
        </div>
        <OfferCard
          offer={offer}
          onAccept={() => handleAcceptOffer(offer.id)}
          onReject={() => handleRejectOffer(offer.id)}
          loadingAction={actionLoading}
        />
      </div>
    </div>
  );
}

SingleOffer.propTypes = {
  offerId: PropTypes.number.isRequired,
};
