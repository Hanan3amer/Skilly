import { useState, useRef, useEffect } from "react";

const VideoPlayer = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setPlaying(false);
  }, [videoUrl]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
          setError(true);
        });
      }
      setPlaying(!playing);
    }
  };

  const handleVideoLoaded = () => {
    setLoading(false);
  };

  const handleVideoError = () => {
    setLoading(false);
    setError(true);
  };

  // If no video URL is provided
  if (!videoUrl) {
    return (
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>لا يوجد فيديو</p>
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-lg overflow-hidden bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p>فشل في تحميل الفيديو</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full max-h-[400px] rounded-lg"
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        controls={!error}
        poster={error ? null : undefined}
      />

      {!playing && !error && !loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer transition-opacity hover:bg-opacity-30"
          onClick={handlePlay}
        >
          <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
