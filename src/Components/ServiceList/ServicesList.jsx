import { Link } from "react-router-dom";
import ServiceCard from "./ServiceCard";

const ServicesList = () => {
  return (
    <section className="flex overflow-hidden flex-col py-7 mt-11 ml-6 w-full rounded-xl border border-solid border-black border-opacity-30 max-w-[1617px] max-md:mt-10 max-md:max-w-full">
      <div className="flex justify-between items-center px-16 max-md:px-5">
        <div className="flex justify-end mb-6">
          <Link
            to="/addservice"
            className="px-6 py-3 text-white bg-sky-500 rounded-lg font-medium hover:bg-sky-600 transition-colors"
          >
            إضافة خدمة جديدة
          </Link>
        </div>
        <h2 className="text-4xl font-bold leading-none text-right text-black">
          خدماتي
        </h2>
      </div>
      <div className="flex flex-col pr-16 pl-4 mt-6 w-full max-md:pr-5 max-md:mt-10 max-md:max-w-full">
        <div className="ml-4 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-[33%] max-md:ml-0 max-md:w-full">
              <ServiceCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/f9cfd55253832bba4ed0088a033cf9a8a5cd024fc56c5467968a0d89a103c285?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                title="عنوان العمل"
                description="وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل"
              />
            </div>
            <div className="w-[33%] max-md:ml-0 max-md:w-full">
              <ServiceCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/a6c69ea129d6ae121b4ec493c46f831192a23076bcb71ff3479cbedf738bcd05?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                title="عنوان العمل"
                description="وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل"
              />
            </div>
            <div className="w-[33%] max-md:ml-0 max-md:w-full">
              <ServiceCard
                image="https://cdn.builder.io/api/v1/image/assets/TEMP/3f171a54665a30b0a1143a77b15b253f552952c9a4de78b87b1508393460afd3?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                title="اسم العمل"
                description="وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل"
              />
            </div>
          </div>
        </div>
        <button className="self-start mt-2.5 text-xs font-bold text-right text-black">
          عرض المزيد ...
        </button>
      </div>
    </section>
  );
};

export default ServicesList;
