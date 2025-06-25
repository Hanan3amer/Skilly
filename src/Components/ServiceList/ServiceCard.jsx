import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Offers from "../Offers/Offers";

const ServiceCard = ({
  image,
  title,
  description,
  id = "service-1",
  offersCount = 0,
}) => {
  const [showOffersModal, setShowOffersModal] = useState(false);

  const handleOffersClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOffersModal(true);
  };
  const [offers, setOffersCount] = useState(offersCount ?? 0);
  return (
    <>
      <Link
        to={`/service/${id}`}
        className="block w-full h-full hover:shadow-lg transition-shadow rounded-xl"
      >
        <article className="flex flex-col grow items-end pt-10 h-full   pb-5 px-9 w-full text-xs text-right rounded-xl bg-neutral-100 max-md:px-5 max-md:mt-7 max-md:max-w-full">
          <div className="w-full cursor-pointer relative">
            <img
              src={image}
              alt={title}
              className="object-cover self-stretch w-full rounded-none aspect-[2]"
            />
          </div>
          <h3 className="mt-1.5 font-bold text-black truncate w-full">
            {title}
          </h3>
          <p className="text-blue-950 overflow-hidden w-full text-ellipsis">
            {description}
          </p>

          <div
            className="flex items-center rounded-xl px-3 py-1 pt-5 cursor-pointer"
            onClick={handleOffersClick}
          >
            <div className="rounded-full bg-[#24234C] w-6 h-6 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{offers}</span>
            </div>
            <span className="text-[#24234C] text-sm ml-2 font-bold">
              العروض
            </span>
          </div>
        </article>
      </Link>

      {showOffersModal && (
        <div className="fixed inset-0 bg-[#00000053] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[35%] p-6 relative">
            <button
              onClick={() => setShowOffersModal(false)}
              className="absolute top-2 right-5 text-gray-500 text-xl"
            >
              &times;
            </button>
            <Offers
              requestId={id}
              changeOffers={(count) => setOffersCount(count)}
            />
          </div>
        </div>
      )}
    </>
  );
};

ServiceCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string,
  offersCount: PropTypes.number,
};

export default ServiceCard;
