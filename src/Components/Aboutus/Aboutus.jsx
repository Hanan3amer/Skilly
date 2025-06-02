import about1 from "../../assets/about1.png";
import about2 from "../../assets/about2.png";
export default function Aboutus() {
  return (
    <div className="container">
      <header className="text-[#27AAE1] font-bold text-3xl text-center my-10">
        <h1>من نحن ؟ </h1>
      </header>
      <div
        className="flex items-center gap-10 md:gap-24  mb-32 flex-col md:flex-row w-full"
        dir="rtl"
      >
        <div className="md:w-1/2 w-full">
          <h2 className="text-[#27AAE1] font-bold text-2xl my-3 p-5">
            مرحبًا بكم في موقعنا !
          </h2>
          <div className="bg-[#E1F0F7]  p-5 rounded-lg">
            <p className="text-sm">
              نحن فريق من الخبراء المتخصصين في تقديم حلول متنوعة لمساعدتكم في
              التعامل مع المشكلات اليومية في المنزل أو في العمل. سواء كنت تواجه
              مشكلة تقنية في البرمجة أو تحتاج إلى إصلاحات منزلية، نحن هنا لنقدم
              لك الدعم
            </p>
            <h3 className="text-[#27AAE1] font-bold text-md my-5">
              نحن نقدم خدمات متعددة تشمل:
            </h3>
            <ul className="list-disc px-5">
              <li className="text-sm py-2 ">
                حلول البرمجة: نقدم حلولاً سريعة وفعالة لمشاكل البرمجة والتطوير
                البرمجي، سواء كانت تتعلق بموقعك الإلكتروني أو تطبيقاتك.
              </li>
              <li className="text-sm py-2">
                إصلاح الأعطال المنزلية: لدينا فريق من المحترفين في مجالات
                الكهرباء، النجارة، والسباكة للتعامل مع أي مشكلة قد تواجهك في
                منزلك.
              </li>
              <li className="text-sm py-2">
                الدعم الفني الشامل: نضمن لك الحصول على حلول مبتكرة وآمنة لجميع
                مشكلاتك التقنية والمنزلية. هدفنا هو تقديم خدمات عالية الجودة
                بأعلى درجات الاحترافية، مع التركيز على توفير الوقت والجهد
                لعملائنا. نحن هنا لتسهيل حياتك اليومية وتحقيق راحتك.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-1/2   " dir="ltr">
          <div className="relative ">
            <img src={about1} className="md:w-3/4" />
            <div className="absolute translate-x-1/2 -translate-y-1/4">
              <img src={about2} className="md:w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
