"use client";
import { useState, useRef } from "react";
import PropTypes from "prop-types";

const NavigationTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("my-services");

  const tabs = [
    { id: "transactions", name: "المعاملات", path: "#transactions" },
    { id: "reviews", name: "التقييمات", path: "#reviews" },
    { id: "previous-work", name: "معرض  الأعمال", path: "#previous-work" },
    { id: "current-work", name: "طلبات قيد التنفيذ", path: "#current-work" },
    { id: "my-services", name: "خدماتي", path: "#my-services" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const navRef = useRef(null);

  // Scroll handler for arrows
  const scrollTabs = (dir) => {
    if (navRef.current) {
      const scrollAmount = 120;
      if (dir === "right") {
        navRef.current.scrollLeft = navRef.current.scrollLeft + scrollAmount;
      } else {
        navRef.current.scrollLeft = navRef.current.scrollLeft - scrollAmount;
      }
      console.log(navRef.current.scrollLeft);
    }
  };

  return (
    <div className="relative w-full flex items-center max-md:py-2">
      {/* Left arrow (scroll right) */}
      <div className="hidden max-md:flex items-center justify-center absolute left-0 z-20 h-full pointer-events-none">
        <button
          type="button"
          className="flex items-center justify-center h-10 w-8 bg-gradient-to-l from-transparent to-white  rounded-l-xl pointer-events-auto"
          style={{ top: 0 }}
          onClick={() => scrollTabs("left")}
          tabIndex={-1}
          aria-label="Scroll left"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-sky-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      {/* Tabs */}
      <nav
        ref={navRef}
        className="flex nowrap gap-6 justify-end max-md:justify-start self-end text-base leading-none text-right text-black  w-full max-md:w-auto max-md:mr-2.5 overflow-x-auto whitespace-nowrap scrollbar-hide px-0 max-md:px-2 max-md:pl-8 max-md:pr-8 min-w-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overflowY: "hidden",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-7 py-5 rounded-xl border border-solid transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-white bg-sky-500 border-transparent"
                : "bg-white  border-black  border-opacity-30 hover:bg-gray-100 "
            } max-md:px-3`}
          >
            <span className="font-bold">{tab.name}</span>
          </button>
        ))}
      </nav>
      {/* Right arrow (scroll left) */}
      <div className="hidden max-md:flex items-center justify-center absolute right-0 z-20 h-full pointer-events-none">
        <button
          type="button"
          className="flex items-center justify-center h-10 w-8 bg-gradient-to-r from-transparent to-white  rounded-r-xl pointer-events-auto"
          style={{ top: 0 }}
          onClick={() => scrollTabs("right")}
          tabIndex={-1}
          aria-label="Scroll right"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-sky-500"
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
    </div>
  );
};

NavigationTabs.propTypes = {
  onTabChange: PropTypes.func,
};

export default NavigationTabs;
