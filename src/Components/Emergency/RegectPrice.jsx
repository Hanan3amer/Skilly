import axios from "axios";
export default function RegectPrice({ requestId, providerId, onReject }) {
  const token = localStorage.getItem("userToken");
  const handleRegect = () => {
    axios
      .post(
        `https://skilly.runasp.net/api/Emergency/reject-offer`,
        { requestId, providerId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        if (onReject) onReject(providerId);
      });
  };

  return (
    <>
      <button
        onClick={handleRegect}
        className="bg-[#23255B] text-white px-5 py-1 rounded-xl"
      >
        رفض
      </button>
    </>
  );
}
