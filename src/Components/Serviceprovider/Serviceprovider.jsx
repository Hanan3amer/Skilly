"use client";

import ServiceCarousel from "./ServiceCarousel";
import ProfileHeader from "./ProfileHeader";
import ServicesList from "./ServicesList";
import RequestedServices from "./RequestedServices";
const ServiceProvider = () => {
  return (
    <main className="flex w-full overflow-hidden flex-col items-center pt-20 pr-6 pb-11 pl-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 max-md:px-5 max-sm:pt-10 max-sm:pb-8">
      <div className="self-end w-full max-w-[1694px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-8">
          <section className="w-[81%] max-md:ml-0 max-md:w-full">
            <ServiceCarousel />
          </section>
          <section className="ml-5 w-[19%] max-md:ml-0 max-md:w-full max-md:mt-4">
            <ProfileHeader />
          </section>
        </div>
        <div className="mt-8 max-md:mt-12 max-sm:mt-8 w-full overflow-hidden">
          <ServicesList />
        </div>
        <div className="mt-8 max-md:mt-12 max-sm:mt-8 w-full overflow-hidden">
          <RequestedServices />
        </div>
      </div>
    </main>
  );
};

export default ServiceProvider;
