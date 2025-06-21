import { useState } from "react";
import ImageGallery from "../Common/ImageGallery";

const GalleryDemo = () => {
  // Sample images for demo
  const sampleImages = [
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
  ];

  const [demoImages] = useState(sampleImages);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        معرض الصور التفاعلي
      </h1>
      <p className="text-center mb-6">
        انقر على أي صورة لفتحها في المعرض الكامل
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-3">معرض صور بسيط</h2>
          <ImageGallery
            images={demoImages.slice(0, 3)}
            className="rounded-lg shadow-md"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">معرض مع صور مصغرة</h2>
          <ImageGallery
            images={demoImages}
            showThumbnails={true}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">معرض بنسبة عرض مختلفة</h2>
        <ImageGallery
          images={demoImages.slice(0, 2)}
          aspectRatio="aspect-[21/9]"
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default GalleryDemo;
