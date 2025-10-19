import { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import Loading from "../Loading/Loading";

const CurrentWork = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderedServices, setRenderedServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          setError("يرجى تسجيل الدخول أولاً");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          "https://skilly.runasp.net/api/Provider/ProviderServices/Get-Services-InProgress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const providerServices =
          response.data.service.providerServices?.map(
            (service) => service?.result || service
          ) || [];
        const requestServices = response.data.service.requestServices || [];
        let allServices = [
          ...providerServices,
          ...requestServices.map((request) => ({
            ...request,
            isRequest: true,
          })),
        ];
        allServices = allServices.map((service) => ({
          ...service,
          images: service.images.map((image) => image?.img),
        }));
        setServices(allServices);
        setRenderedServices(allServices.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("حدث خطأ في تحميل البيانات");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-10">
        <Loading />
      </div>
    );
  }

  return (
    <section className="flex flex-col text-gray-800 " id="current-work">
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-5 text-red-500">{error}</div>
      ) : services.length === 0 ? (
        <div className="text-center p-5">لا توجد طلبات قيد التنفيذ حالياً</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 mt-5">
            {renderedServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                image={
                  service.images?.[0] ||
                  "https://placehold.co/600x400?text=No+Image"
                }
                title={service.name}
                description={service.description}
                isCurrentWork={true}
                isRequest={service.isRequest}
              />
            ))}
          </div>
          {services.length > 6 &&
            renderedServices.length !== services.length && (
              <button
                onClick={() => setRenderedServices(services)}
                className="self-start mt-4 text-sm font-bold text-right text-black  hover:text-sky-600  transition-colors"
              >
                عرض المزيد ...
              </button>
            )}
          {services.length > 6 &&
            renderedServices.length === services.length && (
              <button
                onClick={() => setRenderedServices(services.slice(0, 6))}
                className="self-start mt-4 text-sm font-bold text-right text-black  hover:text-sky-600  transition-colors"
              >
                عرض الأقل ...
              </button>
            )}
        </>
      )}
    </section>
  );
};

export default CurrentWork;
