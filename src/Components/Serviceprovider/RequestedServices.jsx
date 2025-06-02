"use client";
import { useState, useEffect } from "react";
import RequestCard from "./RequestCard";
import axios from "axios";
import Loading from "../Loading/Loading";

const RequestedServices = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortLoading, setSortLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [sortBy, setSortBy] = useState("nearest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [sortBy]);

  const fetchRequests = async () => {
    try {
      if (requests.length > 0) {
        setSortLoading(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("userToken");

      if (!token) {
        setError("يرجى تسجيل الدخول أولاً");
        setLoading(false);
        setSortLoading(false);
        return;
      }

      const response = await axios.get(
        `https://skilly.runasp.net/api/UserProfile/requestServices/GetAllRequestsByCategoryId?sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.services) {
        setRequests(response.data.services);
      } else {
        setRequests([]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setRequests([]);
      } else {
        console.error("Error fetching service requests:", err);
        setError("فشل في تحميل الخدمات المطلوبة");
      }
    } finally {
      setLoading(false);
      setSortLoading(false);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setShowSortOptions(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const hasMore = requests.length > visibleCount;

  return (
    <section className="flex overflow-hidden relative flex-col py-7 mt-11 w-full rounded-xl border border-solid border-black border-opacity-30 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300 max-w-[1617px] max-md:mt-10 max-md:max-w-full">
      <div className="flex justify-between items-center px-16 max-md:px-5 relative">
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer bg-[#F6F7F9]"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12V10H6V12H0ZM0 7V5H12V7H0ZM0 2V0H18V2H0Z"
                fill="black"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              ترتيب حسب
            </span>
          </div>

          {showSortOptions && (
            <div
              className="absolute w-[320px] rounded-xl overflow-hidden border border-gray-300 shadow-lg bg-white z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`py-3 px-4 text-center cursor-pointer ${
                  sortBy === "nearest" ? "bg-[#E5F4F9]" : "bg-white"
                }`}
                onClick={() => handleSortChange("nearest")}
              >
                الأقرب لموقعك
              </div>
              <div
                className={`py-3 px-4 text-center border-t border-gray-300 cursor-pointer ${
                  sortBy === "price" ? "bg-[#E5F4F9]" : "bg-white"
                }`}
                onClick={() => handleSortChange("price")}
              >
                من الأقل سعر إلى أعلى
              </div>
              <div
                className={`py-3 px-4 text-center border-t border-gray-300 cursor-pointer ${
                  sortBy === "date" ? "bg-[#E5F4F9]" : "bg-white"
                }`}
                onClick={() => handleSortChange("date")}
              >
                من الأحدث إلى الأقدم
              </div>
            </div>
          )}
        </div>

        <div className="w-auto">
          <h2 className="text-4xl md:text-2xl font-bold text-right text-gray-800 dark:text-white">
            الخدمات المطلوبه
          </h2>
        </div>
      </div>

      <div className="w-full mt-5 max-md:mt-12 max-sm:mt-8 px-16 max-md:px-5 relative">
        {sortLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 z-10 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg mb-4">
            {error}
          </div>
        )}

        {requests.length === 0 && !loading && !error ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            لا توجد خدمات مطلوبة حالياً
          </div>
        ) : (
          <>
            {/* Display requests in groups of 2 */}
            {Array.from({
              length: Math.ceil(Math.min(visibleCount, requests.length) / 2),
            }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className={`${
                  rowIndex === 0 ? "mt-8" : "mt-5"
                } max-md:mt-4 max-sm:mt-3 max-md:max-w-full`}
              >
                <div className="flex flex-row-reverse gap-5 max-md:gap-4 max-sm:gap-3 max-md:flex-col">
                  {requests
                    .slice(rowIndex * 2, rowIndex * 2 + 2)
                    .map((request) => (
                      <div key={request.id} className="w-6/12 max-md:w-full">
                        <RequestCard
                          id={request.id}
                          date={
                            request.serviceRequestTime?.split("T")[0] ||
                            request.startDate?.split("T")[0]
                          }
                          name={request.userName}
                          title={request.name}
                          description={request.notes}
                          price={`${request.price} ج.م`}
                          offers={request.offersCount.toString()}
                          profileImage={request.userImg}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center mt-8 max-md:mt-6 max-sm:mt-5">
                <button
                  onClick={handleLoadMore}
                  className="px-5 py-2 border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white rounded-lg transition-colors text-sm font-medium dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-500 dark:hover:text-white"
                >
                  عرض المزيد
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RequestedServices;
