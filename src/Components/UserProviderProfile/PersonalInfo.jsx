"use client";
import { useState } from "react";
import PropTypes from "prop-types";

const PersonalInfo = ({ user = {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section className="mt-9">
      <p className="text-base leading-6 text-right text-black dark:text-white max-md:mr-1.5">
        {user.briefSummary ||
          `نجار ماهر متخصص في تصميم وتنفيذ الأثاث والأعمال الخشبية 
        بدقة وإبداع، يتميز بخبرته في اختيار أفضل أنواع الخشب وتحويلها
        إلى قطع فنية تلبي احتياجات العملاء.`}
      </p>

      <div className="flex gap-5 justify-between px-4 py-4 rounded-xl max-md:mr-0.5">
        <span className="text-xs text-sky-500 font-bold text-blue-950 dark:text-blue-200">
          {user.numberOfEndedservices}
        </span>
        <span className="text-sm font-bold ">عدد الأعمال المنتهية</span>
      </div>

      <div
        className="flex gap-5 justify-between px-4 py-4 mt-12 text-sm font-bold text-white bg-sky-500 rounded-xl max-md:mt-10 max-md:mr-1.5 cursor-pointer hover:bg-sky-600 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center">
          <svg
            className={`shrink-0 aspect-[1.1] w-[35px] mr-2 transition-transform duration-300 ${
              !isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        <div className="flex items-center">
          <h3 className="mx-auto">البيانات الشخصيه</h3>
        </div>
      </div>

      <div
        className={`space-y-8 mt-9 transition-all duration-300 overflow-hidden ${
          isCollapsed ? "max-h-0 mt-0 opacity-0" : "max-h-screen opacity-100"
        }`}
      >
        <div className="flex gap-5 justify-between px-4 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl max-md:mr-0.5">
          <span className="text-xs text-blue-950 dark:text-blue-200">
            {user.phoneNumber || user.phone || "غير متوفر"}
          </span>
          <span className="text-sm font-bold text-sky-500">رقم الهاتف</span>
        </div>

        <div className="flex gap-5 justify-between px-4 py-4 whitespace-nowrap bg-gray-200 dark:bg-gray-700 rounded-xl">
          <span className="text-xs text-blue-950 dark:text-blue-200">
            {user.email || "غير متوفر"}
          </span>
          <span className="text-sm font-bold text-sky-500">البريد</span>
        </div>

        <div className="flex gap-5 justify-between px-4 py-4 whitespace-nowrap bg-gray-200 dark:bg-gray-700 rounded-xl max-md:px-5">
          <span className="text-xs text-blue-950 dark:text-blue-200">
            {user.profession || user.job || "غير محدد"}
          </span>
          <span className="text-sm font-bold text-sky-500">المهنه</span>
        </div>

        <div className="flex gap-5 justify-between px-4 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl max-md:px-5 max-md:mr-0.5">
          <span className="self-start text-xs text-black dark:text-white">
            {user.numberOfYearExperience || "غير محدد"}
          </span>
          <span className="text-sm font-bold text-sky-500">
            عدد سنوات الخبره
          </span>
        </div>

        <div className="flex gap-5 justify-between px-4 py-4 whitespace-nowrap bg-gray-200 dark:bg-gray-700 rounded-xl max-md:px-5">
          <span className="text-xs text-blue-950 dark:text-blue-200">
            {user.governorate || "غير محدد"}
          </span>
          <span className="text-sm font-bold text-sky-500">المحافظة</span>
        </div>

        <div className="flex gap-5 justify-between px-4 py-4 whitespace-nowrap bg-gray-200 dark:bg-gray-700 rounded-xl max-md:px-5">
          <span className="text-xs text-blue-950 dark:text-blue-200">
            {user.city || "غير محدد"}
          </span>
          <span className="text-sm font-bold text-sky-500">المدينة</span>
        </div>

        <div className="flex gap-5 justify-between px-4 py-4 whitespace-nowrap bg-gray-200 dark:bg-gray-700 rounded-xl max-md:px-5">
          <span className="text-xs text-blue-950 dark:text-blue-200">
            {user.streetName || "غير محدد"}
          </span>
          <span className="text-sm font-bold text-sky-500">اسم الشارع</span>
        </div>
      </div>
    </section>
  );
};

PersonalInfo.propTypes = {
  user: PropTypes.shape({
    briefSummary: PropTypes.string,
    phoneNumber: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    profession: PropTypes.string,
    job: PropTypes.string,
    numberOfYearExperience: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
};

export default PersonalInfo;
