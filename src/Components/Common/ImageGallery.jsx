import { useState } from 'react';
import PropTypes from 'prop-types';
import ImageModal from './ImageModal';

const ImageGallery = ({ 
  images, 
  className = '', 
  imageClassName = '', 
  aspectRatio = 'aspect-[4/3]', 
  showThumbnails = false 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div 
        className="relative cursor-pointer overflow-hidden rounded-lg" 
        onClick={openModal}
      >
        <img 
          src={typeof images[activeIndex] === 'string' ? images[activeIndex] : images[activeIndex].url} 
          alt={typeof images[activeIndex] === 'string' ? 'صورة' : images[activeIndex].alt || 'صورة'} 
          className={`w-full ${aspectRatio} object-cover ${imageClassName}`}
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <span 
                key={index}
                className={`inline-block h-2 w-2 rounded-full ${
                  index === activeIndex ? 'bg-sky-500' : 'bg-white bg-opacity-60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <div 
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`cursor-pointer w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                index === activeIndex ? 'border-sky-500' : 'border-transparent'
              }`}
            >
              <img 
                src={typeof image === 'string' ? image : image.url}
                alt={typeof image === 'string' ? `صورة ${index + 1}` : image.alt || `صورة ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        initialIndex={activeIndex}
      />
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string
      })
    ])
  ).isRequired,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  aspectRatio: PropTypes.string,
  showThumbnails: PropTypes.bool
};

export default ImageGallery; 