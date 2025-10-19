"use client";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const RequestCard = ({
  id,
  date,
  name,
  title,
  description,
  price,
  offers,
  profileImage,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/request/${id}`);
  };

  return (
    <article className="grow py-6 max-md:py-5 max-sm:py-4 w-full rounded-xl bg-neutral-100  transition-colors duration-300 max-md:mt-8 max-sm:mt-6 max-md:max-w-full overflow-hidden">
      <div className="flex flex-col px-8 max-md:px-6 max-sm:px-4 w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-5 max-sm:gap-3 justify-between w-full max-md:max-w-full">
          <time className="my-auto text-xs font-light text-black ">{date}</time>
          <div className="flex gap-5 items-center max-sm:gap-3 text-base leading-none text-blue-950 ">
            <h3 className="font-bold">{name}</h3>
            <img
              src={profileImage}
              alt={name}
              className="object-cover shrink-0 aspect-[1.19] w-[62px] max-md:w-[50px] max-sm:w-[40px] rounded-full"
            />
          </div>
        </div>
        <h4 className="self-end mt-5 max-md:mt-4 max-sm:mt-3 text-xs font-bold text-right text-blue-500 ">
          {title}
        </h4>
      </div>
      <div className="flex flex-col px-11 max-md:px-8 max-sm:px-5 mt-5 max-md:mt-4 max-sm:mt-3 w-full text-right max-md:max-w-full">
        <p className="text-xs font-light text-blue-950  max-md:max-w-full line-clamp-3 max-md:line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-5 max-sm:gap-4 justify-between mt-11 max-md:mt-8 max-sm:mt-6 w-full">
          <div className="flex gap-6 max-md:gap-4 max-sm:gap-3 max-md:flex-col max-md:items-end">
            <span className="self-center text-xs font-bold text-sky-500 ">
              {price}
            </span>
            <button
              onClick={handleViewDetails}
              className="px-14 max-md:px-10 max-sm:px-6 py-3 max-sm:py-2 text-base max-sm:text-sm font-bold leading-none text-white bg-sky-500 hover:bg-sky-600   rounded-xl transition-colors max-md:px-5"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

RequestCard.propTypes = {
  id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  offers: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
};

export default RequestCard;
