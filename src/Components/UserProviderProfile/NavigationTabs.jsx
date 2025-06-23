"use client";
import { useState } from "react";
import PropTypes from "prop-types";

const NavigationTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("my-services");

  const tabs = [
    { id: "reviews", name: "التقيمات", path: "#reviews" },
    { id: "previous-work", name: "معرض  الأعمال", path: "#previous-work" },
    { id: "my-services", name: "خدماتي", path: "#my-services" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="flex nowrap gap-2 justify-end self-end text-base leading-none text-right text-black dark:text-white w-full max-md:mr-2.5 my-5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`px-4 py-5 rounded-xl border border-solid transition-all duration-300 whitespace-nowrap ${
            activeTab === tab.id
              ? "text-white bg-sky-500 border-transparent"
              : "bg-white dark:bg-gray-800 border-black dark:border-gray-600 border-opacity-30 hover:bg-gray-100 dark:hover:bg-gray-700"
          } max-md:px-3`}
        >
          <span className="font-bold">{tab.name}</span>
        </button>
      ))}
    </nav>
  );
};

NavigationTabs.propTypes = {
  onTabChange: PropTypes.func,
};

export default NavigationTabs;
