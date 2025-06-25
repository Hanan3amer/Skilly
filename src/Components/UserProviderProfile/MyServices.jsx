import { useState, useEffect, useContext, useRef } from "react";
import { ProviderContext } from "../../Context/ProviderContext";
import Loading from "../Loading/Loading";
import ServiceCard from "./ServiceCard";

const MyServices = ({ id }) => {
  const { servicesLoading, getServicesByProviderId } =
    useContext(ProviderContext);
  const [providerServices, setProviderServices] = useState([]);
  const [error, setError] = useState(null);
  const [visibleServices, setVisibleServices] = useState(3);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    const fetchData = async () => {
      try {
        const response = await getServicesByProviderId(id);
        setProviderServices(response.service);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services");
      }
    };

    fetchData();
  }, [getServicesByProviderId, id]);

  const handleShowMore = () => {
    setVisibleServices((prev) => prev + 6);
  };

  const renderServiceCards = () => {
    if (servicesLoading) {
      return (
        <div className="flex justify-center w-full">
          <Loading />
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full text-center py-5">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (!providerServices || providerServices.length === 0) {
      return (
        <div className="w-full text-center py-5">
          <p className="text-gray-500 dark:text-gray-400">
            لا توجد خدمات حالياً
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        {providerServices.slice(0, visibleServices).map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            image={
              service.images?.length > 0
                ? service.images[0].img
                : "https://cdn.builder.io/api/v1/image/assets/TEMP/f9cfd55253832bba4ed0088a033cf9a8a5cd024fc56c5467968a0d89a103c285?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
            }
            title={service.name}
            description={service.description}
          />
        ))}
      </div>
    );
  };

  const showMoreButton =
    !servicesLoading && !error && providerServices?.length > visibleServices;

  return (
    <section
      className="flex flex-col text-gray-800 dark:text-white"
      id="my-services"
    >
      {renderServiceCards()}

      {showMoreButton && (
        <button
          onClick={handleShowMore}
          className="self-start mt-[40px] text-sm font-bold text-right text-black dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          ... عرض المزيد
        </button>
      )}
    </section>
  );
};

export default MyServices;
