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
              نحن فريق من الخبراء المتخصصين تربط بين المستخدمين ومقدّمي الخدمات
              في تجربة سلسة وآمنة، تُمكّنك من الوصول إلى كافة احتياجاتك اليومية
              في مكان واحد. سواء كنت تبحث عن مبرمج لحل مشكلة تقنية، أو تحتاج إلى
              فني لصيانة منزلك، أو ترغب في استكشاف أفضل العروض والخدمات المتاحة
              بالقرب منك , منصتنا توفر لك كل ذلك وأكثر، من خلال نظام ذكي ومترابط
              صُمم لتلبية احتياجاتك بكفاءة واحترافية.
            </p>
            <h3 className=" font-bold text-md my-5">ما يميز منصتنا:</h3>
            <ul className="list-disc px-5 marker:text-[#27AAE1]">
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  مقدّمو خدمات محترفون:
                </span>{" "}
                يمكنك استعراض ملفات مقدّمي الخدمات، مشاهدة معرض أعمالهم السابقة،
                والاطلاع على تقييماتهم لتحديد الأنسب لك.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  سهولة طلب الخدمة:
                </span>{" "}
                المستخدمون يمكنهم طلب الخدمة التي يحتاجونها بسهولة، مع إمكانية
                تخصيص الطلب وتحديد تفاصيله، واستلام عرض سعر من مقدّم الخدمة قبل
                التنفيذ.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  نظام محادثة داخلي:
                </span>{" "}
                تواصل مباشر وسلس بين المستخدم ومقدّم الخدمة لضمان وضوح جميع
                التفاصيل قبل وأثناء تنفيذ الخدمة.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">إشعارات فورية:</span>{" "}
                لمتابعة آخر التحديثات على طلباتك ومراسلاتك بشكل لحظي.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  نظام النقاط والمكافآت:
                </span>{" "}
                احصل على نقاط مقابل استخدامك للمنصة وفعّاليتك في التقييم
                والتفاعل، واستخدمها في خصومات أو خدمات مستقبلية.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  الدفع الإلكتروني الآمن:
                </span>{" "}
                نوفر طرق دفع مرنة وآمنة لتسهيل عمليات الدفع بين الطرفين.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">نظام الطوارئ:</span>{" "}
                في حال وجود حالة طارئة، يمكن للمستخدم تفعيل خيار
                &quot;الطوارئ&quot; ليحصل على الخدمة بأولوية فورية.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  تقييم ومراجعة الخدمات:
                </span>{" "}
                بعد إتمام أي خدمة، يمكن لكل مستخدم تقييم التجربة وإبداء رأيه
                لتحسين الجودة وتعزيز الشفافية.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">
                  الاعتماد على الموقع الجغرافي:
                </span>{" "}
                ساعدنا في ربطك بأقرب مقدّمي خدمات في منطقتك لتحقيق الاستجابة
                الأسرع.
              </li>
              <li className="text-sm py-1 ">
                <span className="font-bold text-[#27AAE1]">فلترة الخدمات:</span>{" "}
                استعرض الخدمات بشكل مصنف حسب التخصص، التقييم، السعر، والمسافة،
                لتحصل على ما يناسبك بدقة.
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
