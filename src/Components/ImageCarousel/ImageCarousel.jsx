import { useState, useEffect } from "react";
import PropTypes from "prop-types";
export const ImageCarousel = ({ images, activeIndex = 0, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  ImageCarousel.propTypes = {
    images: PropTypes.any.isRequired,
    activeIndex: PropTypes.any.isRequired,
    onImageChange: PropTypes.any.isRequired,
  };
  const defaultImages = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/1ed08115a875e30f2aebcbbad16601ca9210be1aca926b5ced490efda0b54f54?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/cd57bd839a880ee086512caf115b3cdac52773e7",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/899da5e68d0e7f10ecf793f64d94881366793274",
  ];

  const displayImages = images || defaultImages;

  useEffect(() => {
    setCurrentIndex(activeIndex);
    if (onImageChange) {
      onImageChange(activeIndex);
    }
  }, [activeIndex, onImageChange]);

  const goToPrevious = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const newIndex =
      currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);

    if (onImageChange) {
      onImageChange(newIndex);
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const newIndex =
      currentIndex === displayImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);

    if (onImageChange) {
      onImageChange(newIndex);
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToIndex = (index) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    if (onImageChange) {
      onImageChange(index);
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-xl w-full">
        <img
          src={displayImages[currentIndex]}
          alt={`Carousel image ${currentIndex + 1}`}
          className="object-cover w-full rounded-xl h-[400px] transition-opacity duration-300"
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        />
      </div>

      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Previous image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Next image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex gap-2 justify-center mt-4">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-sky-500 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
