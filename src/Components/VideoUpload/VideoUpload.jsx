import { useState, useRef, useEffect } from "react";

const VideoUpload = ({ onVideoUpdate, initialVideo = null }) => {
  const [video, setVideo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize with provided video if available
  useEffect(() => {
    if (initialVideo && initialVideo.url) {
      setPreviewUrl(initialVideo.url);
      if (initialVideo.file) setVideo(initialVideo.file);
    }
  }, [initialVideo]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    handleVideoFile(selectedFile);
  };

  const handleVideoFile = (file) => {
    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      alert("الرجاء تحميل ملف فيديو فقط.");
      return;
    }

    // Simulate upload process
    setIsUploading(true);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Store video file
    setVideo(file);

    // Notify parent component
    if (onVideoUpdate) onVideoUpdate(file);

    // Simulate upload completion
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
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

    const droppedFile = Array.from(e.dataTransfer.files)[0];
    if (!droppedFile) return;

    handleVideoFile(droppedFile);
  };

  const removeVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setVideo(null);
    setPreviewUrl(null);
    if (onVideoUpdate) onVideoUpdate(null);
  };

  const openFileSelector = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div
      className={`flex flex-col justify-center items-center p-1 border border-dashed w-full rounded-xl transition-all ${
        isDragging
          ? "bg-sky-50 border-2 border-sky-500"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {!video && !previewUrl ? (
        <div
          onClick={openFileSelector}
          className="flex flex-col items-center justify-center cursor-pointer w-full"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
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
          <p className="text-base text-center text-gray-500">
            انقر لتحميل الفيديو أو اسحب وأفلت
          </p>
        </div>
      ) : (
        <div className="relative w-full">
          {isUploading ? (
            <div className="flex items-center justify-center h-36">
              <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                  {Math.round((Date.now() % 1000) / 10)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                src={previewUrl}
                className="w-full h-36 object-cover rounded-xl"
                controls
              />
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={removeVideo}
                  className="px-2 py-1 bg-red-500 text-sm text-white rounded hover:bg-red-600 transition-colors"
                >
                  حذف الفيديو
                </button>
                <span className="text-gray-500 text-xs">
                  {video?.name}
                  {video?.size &&
                    " (" +
                      Math.round((video?.size / 1024 / 1024) * 10) / 10 +
                      " MB)"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
