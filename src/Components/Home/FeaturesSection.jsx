import { features } from "../../data/features";

export default function FeaturesSection() {
  return (
    <section className="container mx-auto text-center my-20">
      <h2 className="text-[#27AAE1] font-bold text-3xl my-10">
        المزايا الخاصة بنا
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 max-w-xs mx-auto"
            >
              <Icon size={40} className="text-[#27AAE1] mx-auto" />
              <h3 className="text-lg font-bold text-[#27AAE1] mt-4">
                {feature.title}
              </h3>
              <p className="text-gray-700 mt-2 text-sm font-semibold">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
