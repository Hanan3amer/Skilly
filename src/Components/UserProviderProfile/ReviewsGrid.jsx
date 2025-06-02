"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import ReviewCard from "./ReviewCard";
const ReviewsGrid = ({ id }) => {
  const [expandedView, setExpandedView] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");

        if (!token) {
          setError("يرجى تسجيل الدخول أولاً");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://skilly.runasp.net/api/Provider/Review/GetAllReviewsBy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.reviews) {
          setReviews(response.data.reviews.reviews);
          console.log("Reviews data loaded:", response.data.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        if (err.response.status === 404) {
          setReviews([]);
        } else {
          console.error("Error fetching reviews:", err);
          setError("فشل في تحميل التقييمات");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const displayedReviews = expandedView ? reviews : reviews.slice(0, 6);

  const toggleExpandView = () => {
    setExpandedView(!expandedView);
  };

  const renderReviews = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center w-full py-10">
          <Loading />
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full text-center py-6">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (!reviews || reviews.length === 0) {
      return (
        <div className="w-full text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">
            لا توجد تقييمات حالياً
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1 w-full">
        {displayedReviews.map((review, index) => (
          <ReviewCard
            key={index}
            userName={review.userName || "مستخدم"}
            userImage={
              review.userImage ||
              "https://cdn.builder.io/api/v1/image/assets/TEMP/1c33c67ab3d871d1548caa73a7bb5b26af3f032f8bdf5192f327fc57d4da5ba3?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
            }
            feedback={review.feedback || "لا يوجد تعليق"}
            rating={review.rating || 0}
            serviceName={review.serviceName || "خدمة"}
          />
        ))}
      </div>
    );
  };

  const showToggleButton = !loading && !error && reviews.length > 6;

  return (
    <section
      className="flex flex-col w-full text-gray-800 dark:text-white min-h-[300px]"
      id="reviews"
    >
      <div className="mt-5 w-full max-md:max-w-full">{renderReviews()}</div>

      {showToggleButton && (
        <button
          onClick={toggleExpandView}
          className="flex gap-px self-end mt-6 text-sm font-bold text-right text-black dark:text-white max-md:mr-2.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          {expandedView ? (
            <>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/22ff5556b0362aa3d070b6d843532fc9900fa3bfa942cb82677b39300b709533?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                className="object-contain shrink-0 w-6 aspect-square rotate-180"
                alt="Show less icon"
              />
              <span className="my-auto">عرض أقل</span>
            </>
          ) : (
            <>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/22ff5556b0362aa3d070b6d843532fc9900fa3bfa942cb82677b39300b709533?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                className="object-contain shrink-0 w-6 aspect-square"
                alt="Show more icon"
              />
              <span className="my-auto">عرض المزيد</span>
            </>
          )}
        </button>
      )}
    </section>
  );
};

export default ReviewsGrid;
