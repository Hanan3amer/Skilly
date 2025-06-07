import { popularWorks } from "../../data/popularWork";
export default function PopularWorks() {
  return (
    <section className="container">
      <h2 className="text-[#27AAE1] font-bold text-3xl my-20 text-center">
        الأعمال الأكثر طلبًا
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        dir="rtl"
      >
        {popularWorks.map((work, index) => (
          <div key={index} className="rounded-lg p-4 bg-gray-200">
            <img
              src={work.img}
              alt={work.title}
              className="rounded-lg w-full h-40 object-cover"
            />
            <h3 className="text-sm font-bold text-gray-700 text-center mt-3">
              {work.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
