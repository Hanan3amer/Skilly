import { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import Loading from "../Loading/Loading";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PreviousWork = ({ providerId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        const response = await axios.get(
          `https://skilly.runasp.net/api/Provider/Servicegallery/GetAllServicegalleryByproviderId?id=${
            providerId || "a7d6f953-4e8a-40fe-880c-a35f388bd133"
          }`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (response.data && response.data.servicesgallery) {
          setServices(response.data.servicesgallery);
        } else {
          setServices([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching service gallery:", err);
        setError("حدث خطأ أثناء تحميل معرض الخدمات");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [providerId]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (services.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        <div className="flex justify-between items-center mb-6 mt-5">
        <Link
          to="/addservice?isGallary=true"
          className="px-5 py-2.5 text-white bg-sky-500 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm"
        >
          إضافة عمل
        </Link>
      </div>
        لا توجد أعمال سابقة لعرضها
      </div>
    );
  }

  return (
    <section
      className="flex flex-col text-gray-800 dark:text-white"
      id="previous-work"
    >
      <div className="flex justify-between items-center mb-6 mt-5">
        <Link
          to="/addservice?isGallary=true"
          className="px-5 py-2.5 text-white bg-sky-500 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm"
        >
          إضافة عمل
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 mt-5">
        {services.slice(0, visibleCount).map((service) => (
          <ServiceCard
            key={service.id}
            image={
              service.images && service.images.length > 0
                ? service.images[0].img
                : "https://via.placeholder.com/300x200/eee?text=لا+توجد+صورة"
            }
            title={service.galleryName}
            description={service.description}
            id={service.id}
            isGallery={true}
          />
        ))}
      </div>
      {visibleCount < services.length && (
        <button
          onClick={handleShowMore}
          className="self-start mt-4 text-sm font-bold text-right text-black dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          عرض المزيد ...
        </button>
      )}
    </section>
  );
};

PreviousWork.propTypes = {
  providerId: PropTypes.string,
};

export default PreviousWork;