"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const ServiceCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          "https://skilly.runasp.net/api/Banner/GetAllBanners",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.banners) {
          // Map API response to the format expected by the carousel
          const bannerData = response.data.banners.map((banner) => ({
            id: banner.id,
            image: banner.imagePath,
            title: banner.title,
            url: banner.url,
          }));

          setSlides(bannerData);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);

        // Fallback to default slides if API fails
        setSlides([
          {
            id: 1,
            image:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/1ed08115a875e30f2aebcbbad16601ca9210be1aca926b5ced490efda0b54f54?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c",
            title: "خدمة تصميم جرافيك متميزة",
            url: "#",
          },
          {
            id: 2,
            image:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/fd00acedcaa64786a60209b66ff1655b0133677b?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c",
            title: "خدمة برمجة متكاملة",
            url: "#",
          },
          {
            id: 3,
            image:
              "https://cdn.builder.io/api/v1/image/assets/TEMP/be3de937f822e9931b989374fb45c1f8a910217e20249177eb5cc79b164a798b?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c",
            title: "خدمة تحليل بيانات احترافية",
            url: "#",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Loading state
  if (loading && slides.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-gray-200  animate-pulse h-[300px] max-md:h-[250px] max-sm:h-[200px]">
        <div className="h-full w-full flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // If no slides available after loading
  if (!loading && slides.length === 0) {
    return (
      <div className="w-full rounded-3xl bg-gray-100  h-[300px] max-md:h-[250px] max-sm:h-[200px] flex justify-center items-center">
        <p className="text-gray-500 ">لا توجد إعلانات متاحة</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-md:mt-8 max-sm:mt-4 max-md:max-w-full overflow-hidden">
      <div className="relative w-full rounded-3xl overflow-hidden">
        {/* Image and overlay */}
        <img
          src={slides[activeSlide].image}
          alt={slides[activeSlide].title}
          className="object-cover w-full rounded-3xl aspect-[3.61] max-md:aspect-[2.5] max-sm:aspect-[1.8] max-md:max-w-full transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-8 max-md:p-5 max-sm:p-4">
          <h2 className="text-white text-2xl max-md:text-xl max-sm:text-lg font-bold mb-4 max-sm:mb-3 text-right">
            {slides[activeSlide].title}
          </h2>
          <a
            href={slides[activeSlide].url}
            target="_blank"
            rel="noopener noreferrer"
            className="self-end bg-sky-500 text-white px-6 py-2 max-sm:px-4 max-sm:py-1.5 rounded-lg font-bold hover:bg-sky-600 transition "
          >
            عرض المزيد
          </a>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80  rounded-full p-2 shadow-md hover:bg-white  transition text-gray-800  max-md:scale-90 max-sm:scale-75"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80  rounded-full p-2 shadow-md hover:bg-white transition text-gray-800  max-md:scale-90 max-sm:scale-75"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      </div>

      {/* Dot indicators */}
      <div className="flex gap-4 self-center mt-4 w-auto">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex shrink-0 h-3 rounded-full w-[15px] transition-colors ${
              activeSlide === index ? "bg-sky-500 " : "bg-black/40 "
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceCarousel;
