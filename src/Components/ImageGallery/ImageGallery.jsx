import { useState, useEffect } from "react";

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesWithFallback, setImagesWithFallback] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Process images to handle potential errors
    if (images && images.length > 0) {
      setImagesWithFallback(images);
    } else {
      // Use a placeholder if no images are provided
      setImagesWithFallback([
        "https://cdn.builder.io/api/v1/image/assets/TEMP/cd57bd839a880ee086512caf115b3cdac52773e7"
      ]);
    }
    setLoading(false);
  }, [images]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imagesWithFallback.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imagesWithFallback.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleImageError = (e) => {
    e.target.src = "https://cdn.builder.io/api/v1/image/assets/TEMP/cd57bd839a880ee086512caf115b3cdac52773e7";
  };

  if (loading) {
    return (
      <div className="w-full h-80 flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="w-full h-80 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 relative">
        {imagesWithFallback.length > 0 && (
          <img
            src={imagesWithFallback[currentIndex]}
            alt={`Service Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}

        {/* Left & Right Controls */}
        {imagesWithFallback.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails/Dots for navigation */}
      {imagesWithFallback.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {imagesWithFallback.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index 
                ? 'bg-sky-500 scale-125' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {imagesWithFallback.length > 1 && (
        <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
          {imagesWithFallback.map((image, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === index 
                ? 'border-sky-500 opacity-100 scale-105' 
                : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
