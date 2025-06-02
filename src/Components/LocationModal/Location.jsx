import axios from "axios";
import { useEffect, useState } from "react";
import location from "../../assets/location.png";
export default function Location() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("userToken");
    const locationAllowed = userData
      ? userData.latitude && userData.longitude
      : token
      ? localStorage.getItem("locationAllowed") === "true"
      : true;
    if (!locationAllowed) {
      setTimeout(() => setShow(true), 500);
    }
  }, []);
  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          axios
            .post(
              "https://skilly.runasp.net/api/Location/Addlocation",
              {
                latitude,
                longitude,
              },
              {
                headers: {
                  ...(localStorage.getItem("userToken") && {
                    Authorization: `Bearer ${localStorage.getItem(
                      "userToken"
                    )}`,
                  }),
                },
              }
            )
            .then((res) => {
              console.log(res);
              localStorage.setItem("locationAllowed", "true");
              const userData = JSON.parse(localStorage.getItem("userData"));
              if (userData) {
                userData.latitude = latitude;
                userData.longitude = longitude;
                localStorage.setItem("userData", JSON.stringify(userData));
              }
              setShow(false);
            })
            .catch((error) => {
              console.error("فشل في إرسال الموقع:", error);
            });
        },
        (error) => {
          console.error("فشل في تحديد الموقع:", error);
        }
      );
    } else {
      console.error("المتصفح لا يدعم تحديد الموقع.");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full flex justify-center z-50 transition-transform duration-700 ease-in-out ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-white shadow-md  rounded-b-xl max-w-xl w-full">
        <div className="flex flex-col  items-center justify-center text-center gap-3">
          <div className="md:w-1/2 w-full">
            <img src={location} className="w-1/2 mx-auto" />
          </div>
          <div className="md:w-1/2 w-full">
            <p className="font-bold text-black text-md mb-2">
              نحتاج إلى الوصول إلى موقعك الحالي لعرض المحتوى المناسب لك
            </p>
            <p className="font-bold text-black text-sm">
              هل ترغب في السماح بالوصول إلى موقعك؟
            </p>
            <button
              onClick={handleAllow}
              className="mx-auto text-center my-3 font-bold text-white bg-[#27AAE1] px-10 py-2 rounded-lg"
            >
              سماح
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
