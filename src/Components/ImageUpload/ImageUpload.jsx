import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import ImageGallery from "../Common/ImageGallery";

const ImageUpload = ({ onImagesUpdate, initialImages = [], onDeleteImage }) => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const fileInputRef = useRef(null);

  ImageUpload.propTypes = {
    onImagesUpdate: PropTypes.any.isRequired,
    initialImages: PropTypes.any.isRequired,
  };
  // Initialize with any provided images
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
      setSelectedImageIndex(0);
    }
  }, [initialImages]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newImages = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      file: file,
    }));

    const updatedImages = [...images, ...newImages].slice(0, 5); // Limit to 5 images
    setImages(updatedImages);
    if (onImagesUpdate) onImagesUpdate(updatedImages);

    // Select the first image if none is selected
    if (selectedImageIndex === null && updatedImages.length > 0) {
      setSelectedImageIndex(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter for image files only
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("الرجاء إضافة ملفات صور فقط");
      return;
    }

    const newImages = imageFiles.map((file) => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      file: file,
    }));

    const updatedImages = [...images, ...newImages].slice(0, 5); // Limit to 5 images
    setImages(updatedImages);
    if (onImagesUpdate) onImagesUpdate(updatedImages);

    // Select the first image if none is selected
    if (selectedImageIndex === null && updatedImages.length > 0) {
      setSelectedImageIndex(0);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const imageUrl = updatedImages[index].url;
    if (onDeleteImage) onDeleteImage(imageUrl);
    URL.revokeObjectURL(imageUrl); // Clean up the URL
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    if (onImagesUpdate) onImagesUpdate(updatedImages);
    // Update selected image index
    if (updatedImages.length === 0) {
      setSelectedImageIndex(null);
    } else if (index === selectedImageIndex) {
      setSelectedImageIndex(0);
    } else if (index < selectedImageIndex) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full">
      {images.length > 0 && selectedImageIndex !== null ? (
        <div className="w-full mb-4">
          {/* Using ImageGallery for display */}
          <ImageGallery 
            images={images} 
            showThumbnails={true}
            className="rounded-lg"
            aspectRatio="aspect-[16/9]"
          />
          
          {/* Add button for more images if less than 5 */}
          {images.length < 5 && (
            <div 
              className="w-full mt-2 h-12 bg-gray-100 rounded-md flex justify-center items-center cursor-pointer border border-dashed border-gray-300 hover:bg-gray-200 transition-colors"
              onClick={triggerFileInput}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-gray-500">إضافة المزيد من الصور</span>
            </div>
          )}
          
          {/* Remove buttons for each image */}
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative w-16 h-16 flex-shrink-0"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors"
                  onClick={() => handleRemoveImage(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`flex justify-center items-center w-full h-36 border border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? "bg-sky-50 border-sky-400"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          }`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center p-4">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-3"
            >
              <path
                d="M82.395 9.295V15.4916H65.869V24.7866H54.851V15.4916H38.325V9.295H54.851V0H65.869V9.295H82.395ZM35.57 30.9833C40.132 30.9833 43.834 28.9012 43.834 26.3358C43.834 23.7704 40.132 21.6883 35.57 21.6883C31.009 21.6883 27.307 23.7704 27.307 26.3358C27.307 28.9012 31.009 30.9833 35.57 30.9833ZM54.851 41.0032L52.025 39.2372C47.651 36.4952 40.016 36.4952 35.631 39.2372L32.023 41.499L5.272 24.7866L-11.255 35.1133V15.4916H27.307V9.295H-11.255C-17.342 9.295 -22.272 12.068 -22.272 15.4916V52.672C-22.272 56.095 -17.342 58.868 -11.255 58.868H54.851C60.938 58.868 65.869 56.095 65.869 52.672V30.9833H54.851V41.0032Z"
                fill="#6C757D"
                fillOpacity="0.4"
                transform="translate(22, 20)"
              />
            </svg>
            <p className="text-base text-gray-500">
              اضغط لإضافة صورة أو اسحب وأفلت هنا
            </p>
          </div>
        </div>
      )}

      <input
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </div>
  );
};

ImageUpload.propTypes = {
  onImagesUpdate: PropTypes.func,
  initialImages: PropTypes.array
};

export default ImageUpload;
