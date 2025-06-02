import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

const ImageModal = ({ isOpen, onClose, images, initialIndex = 0 }) => {
  const [swiper, setSwiper] = useState(null);

  // Set initial slide
  useEffect(() => {
    if (swiper && isOpen) {
      swiper.slideTo(initialIndex, 0);
    }
  }, [swiper, initialIndex, isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <div 
        className="relative w-[90vw] h-[80vh] max-w-7xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Swiper
          modules={[Navigation, Pagination, Zoom]}
          navigation
          pagination={{ clickable: true }}
          zoom={{ maxRatio: 3 }}
          spaceBetween={30}
          slidesPerView={1}
          onSwiper={setSwiper}
          dir="rtl" // Right to left for Arabic
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <div className="swiper-zoom-container">
                <img 
                  src={typeof image === 'string' ? image : image.url} 
                  alt={typeof image === 'string' ? `صورة ${index + 1}` : image.alt || `صورة ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string
      })
    ])
  ).isRequired,
  initialIndex: PropTypes.number
};

export default ImageModal; 