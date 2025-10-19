import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../ServiceList/ServiceCard";
import { ProviderContext } from "../../Context/ProviderContext";

const ServicesList = () => {
  const [visibleServices, setVisibleServices] = useState(3);
  const { servicesLoading, getProviderServices } = useContext(ProviderContext);
  const [providerServices, setProviderServices] = useState([]);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    const fetchData = async () => {
      try {
        const response = await getProviderServices();
        setProviderServices(response.service);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services");
      }
    };

    fetchData();
  }, []);

  const showMoreServices = () => {
    setVisibleServices((prev) => prev + 3);
  };

  const renderServices = () => {
    if (servicesLoading) {
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="w-[33%] max-md:ml-0 max-md:w-full"
          >
            <div className="flex flex-col grow items-end py-10 px-9 w-full text-xs text-right rounded-xl bg-neutral-100 max-md:px-5 max-md:mt-7 max-md:max-w-full animate-pulse">
              <div className="self-stretch w-full rounded-none aspect-[2] bg-gray-300" />
              <div className="mt-1.5 w-2/3 h-4 bg-gray-300 rounded" />
              <div className="mt-1 w-full h-3 bg-gray-300 rounded" />
              <div className="mt-0.5 w-full h-3 bg-gray-300 rounded" />
            </div>
          </div>
        ));
    }

    if (error) {
      return (
        <div className="w-full text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }
    if (!providerServices || providerServices.length === 0) {
      return (
        <div className="w-full text-center py-10">
          <p className="text-gray-500">لا توجد خدمات حالياً</p>
        </div>
      );
    }
    return providerServices.slice(0, visibleServices).map((service) => (
      <div key={service.id} className="w-[33%] max-md:ml-0 max-md:w-full">
        <ServiceCard
          id={service.id}
          image={
            service.images?.length > 0
              ? service.images[0]
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/f9cfd55253832bba4ed0088a033cf9a8a5cd024fc56c5467968a0d89a103c285?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
          }
          title={service.name}
          description={service.description}
          offersCount={service.countOfOffers ?? 0}
        />
      </div>
    ));
  };

  const showMoreButton =
    providerServices?.length > visibleServices && !servicesLoading && !error;

  return (
    <section className="flex overflow-hidden flex-col py-7 mt-11 w-full rounded-xl border border-solid border-black border-opacity-30  bg-white  transition-colors duration-300 max-w-[1617px] max-md:mt-10 max-md:max-w-full">
      <div className="flex justify-end items-center px-16 max-md:px-5">
        <h2 className="text-4xl font-bold leading-none text-right text-black ">
          خدماتي
        </h2>
      </div>
      <div className="flex flex-col pr-16 pl-4 mt-6 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="max-md:max-w-full">
          <div className="flex gap-5 max-md:gap-4 max-sm:gap-3 max-md:flex-col">
            {renderServices()}
          </div>
        </div>
        {showMoreButton && (
          <Link
            className="text-xs font-bold text-left text-black  hover:text-sky-500 transition-colors mb-3 mt-4"
            to={"/mainprofile"}
          >
            ... عرض المزيد
          </Link>
        )}
        <div className="flex flex-col items-center mt-6 max-md:mt-8">
          <Link
            to="/addservice"
            className="px-14 max-md:px-10 max-sm:px-6 py-5 max-sm:py-2 text-base max-sm:text-sm font-bold leading-none text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors max-md:px-5 text-center"
          >
            إضافة خدمة جديدة
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
