import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";
export default function Praivcy() {
  return (
    <div className="container">
      <div
        className="flex items-center gap-10 md:gap-24  mb-32 flex-col md:flex-row w-full"
        dir="rtl"
      >
        <div className="md:w-1/3 w-full">
          <h2 className="text-[#27AAE1] font-bold text-2xl my-3 p-5">
            سياسة الخصوصية
          </h2>
          <div className="bg-[#E1F0F7]  p-5 rounded-lg">
            <p className="text-md">
              في موقعنا، نحترم خصوصيتك وملتزمون بحماية البيانات الشخصية التي
              تشاركها معنا. تهدف هذه السياسة إلى توضيح كيفية جمع واستخدام وحماية
              معلوماتك عند تصفحك لموقعنا.
            </p>
            <ul className="list-decimal px-5">
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                المعلومات التي نجمعها
              </li>
              <ul className="list-disc ">
                قد نقوم بجمع أنواع مختلفة من البيانات، ومنها:
                <li>
                  الاسم والبريد الإلكتروني في حال قمت بالتسجيل أو التواصل معنا.
                </li>
                <li>
                  أي معلومات تقوم بإدخالها طواعية عبر النماذج أو أثناء التسجيل
                </li>
              </ul>

              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                كيف نستخدم المعلومات؟
              </li>
              <ul className="list-disc ">
                نستخدم البيانات التي نجمعها من أجل:
                <li>تحسين تجربتك على الموقع.</li>
                <li>الرد على استفساراتك وتقديم الدعم.</li>
                <li>تحليل استخدام الموقع بهدف تحسين الخدمات والمحتوى.</li>
              </ul>
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                حماية المعلومات
              </li>
              <p>
                نلتزم باتخاذ الإجراءات الأمنية المناسبة لحماية بياناتك من الوصول
                أو التعديل أو الكشف غير المصرح به. ومع ذلك، فإن نقل البيانات عبر
                الإنترنت لا يمكن أن يكون آمناً بنسبة 100%.
              </p>
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                مشاركة المعلومات
              </li>
              <p>
                نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أي طرف ثالث،
                باستثناء الحالات الضرورية لتقديم الخدمة (مثل شركات الدفع أو
                الشحن)، ومع التزامهم بحماية هذه البيانات.
              </p>
            </ul>
          </div>
        </div>
        <div className="w-1/2   " dir="ltr">
          <div className="relative ">
            <img src={p2} className="md:w-3/4" />
            <div className="absolute translate-x-1/2 -translate-y-1/4">
              <img src={p1} className="md:w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
