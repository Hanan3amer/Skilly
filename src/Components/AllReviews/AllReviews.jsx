import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import review from "../../assets/Review.svg";
export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  function getallReviews(id) {
    axios
      .get(`https://skilly.runasp.net/api/Provider/Review/GetReviewsBy/${id}`)
      .then((res) => {
        console.log(res.data.reviews.reviews);
        setReviews(res.data.reviews.reviews);
      });
  }
  useEffect(() => {
    getallReviews(id);
  }, [id]);
  return (
    <div className="container p-5 my-10">
      <h1 className="text-xl font-bold text-[#27AAE1] text-center my-10">
        التقييمات
      </h1>
      <div className="border border-gray-300 rounded-3xl max-w-xl mx-auto p-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.serviceId}
              className="bg-gray-100 p-3 rounded-xl my-5"
            >
              <div className="flex items-center flex-row-reverse gap-3 my-3">
                <img
                  src={review.userImage}
                  className="w-12 h-12 rounded-full"
                />
                <h2 className="text-[#23255B] font-bold">{review.userName}</h2>
              </div>
              <p className="text-md text-[#23255B] flex justify-end me-3">
                {review.feedback}
              </p>
              <div className="flex gap-1 text-yellow-400 text-lg" dir="ltr">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-400"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <>
            <p className="text-center my-5 text-red-400">
              لا توجد تقييمات لهذه الخدمة
            </p>
            <img src={review} />
          </>
        )}
      </div>
    </div>
  );
}
