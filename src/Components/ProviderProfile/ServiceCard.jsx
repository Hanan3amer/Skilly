"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ServiceCard = ({
  image,
  title,
  description,
  id = "service-1",
  offersCount = 0,
  isCurrentWork = false,
  deliveryTime,
  hasVideo = false,
  videoUrl,
  images = [],
  isGallery = false,
  isRequest = false,
}) => {
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVideo(!showVideo);
  };

  return (
    <Link
      to={
        `/${isGallery ? "gallery" : "service"}/${id}` +
        (isCurrentWork
          ? "?isCurrentWork=true" + (isRequest ? "&isRequest=true" : "")
          : "")
      }
      className="block w-full hover:shadow-lg transition-shadow rounded-xl overflow-hidden"
    >
      <article className="flex flex-col h-full grow items-end py-10 px-9 w-full text-xs text-right rounded-xl bg-neutral-100  transition-colors duration-300 max-md:px-5 max-md:py-6 max-md:mt-7 max-md:max-w-full">
        <div className="w-full relative">
          {showVideo && hasVideo && videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="object-cover self-stretch w-full rounded-md aspect-[2]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={image}
              alt={title}
              className="object-cover self-stretch w-full rounded-md aspect-[2]"
            />
          )}

          {/* Video toggle button */}
          {hasVideo && videoUrl && (
            <button
              onClick={handleVideoToggle}
              className="absolute top-3 left-3 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70"
              aria-label={showVideo ? "عرض الصورة" : "عرض الفيديو"}
            >
              {showVideo ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Multiple images indicator */}
          {images && images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full py-1 px-2 text-white text-xs">
              {images.length} صور
            </div>
          )}

          {offersCount > 0 && (
            <div className="absolute bottom-4 right-4 z-10">
              <div className="flex items-center bg-[#24234C] rounded-xl px-3 py-1">
                <span className="text-white text-sm ml-2">العروض</span>
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-[#24234C] text-sm font-bold">
                    {offersCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-between items-start mt-3">
          <div className="text-sm text-sky-500 font-medium">
            {deliveryTime && <span>وقت التسليم: {deliveryTime}</span>}
          </div>
          <h3 className="text-sm md:text-base font-bold text-black ">
            {title}
          </h3>
        </div>
        <p className="mt-2 text-blue-950 ">{description}</p>
      </article>
    </Link>
  );
};

ServiceCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string,
  offersCount: PropTypes.number,
  isCurrentWork: PropTypes.bool,
  deliveryTime: PropTypes.string,
  hasVideo: PropTypes.bool,
  videoUrl: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ServiceCard;
