import sh1 from "../../assets/sh1.png";
import sh2 from "../../assets/sh2.png";
export default function Terms() {
  return (
    <div className="container">
      <div
        className="flex items-center gap-10 md:gap-24  mb-32 flex-col md:flex-row w-full"
        dir="rtl"
      >
        <div className="md:w-1/3 w-full">
          <h2 className="text-[#27AAE1] font-bold text-2xl my-3 p-5">
            الشروط والاحكام
          </h2>
          <div className="bg-[#E1F0F7]  p-5 rounded-lg">
            <p className="text-md">
              مرحبًا بك في موقعنا! من خلال استخدامك لهذا الموقع، فإنك توافق على
              الالتزام بالشروط والأحكام التالية. يُرجى قراءتها بعناية قبل
              استخدام الموقع.
            </p>
            <ul className="list-decimal px-5">
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                قبول الشروط
              </li>
              <p>
                باستخدام هذا الموقع، فإنك توافق على الالتزام بهذه الشروط
                والأحكام، وإذا لم توافق على أي جزء منها، نرجو عدم استخدام
                الموقع.
              </p>
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                التعديلات على الشروط
              </li>
              <p>
                نحتفظ بالحق في تعديل أو تحديث هذه الشروط في أي وقت دون إشعار
                مسبق. استمرارك في استخدام الموقع بعد التعديلات يُعتبر موافقة منك
                على الشروط المعدّلة.
              </p>
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                استخدام الموقع
              </li>
              <ul className="list-disc">
                <li>
                  لا يجوز لك استخدام الموقع لأي غرض غير قانوني أو ممنوع بموجب
                  هذه الشروط.
                </li>
                <li>
                  يجب أن تلتزم بعدم التسبب بأي ضرر للموقع أو تعطيله أو تحميله
                  بشكل مفرط.
                </li>
              </ul>
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                الملكية الفكرية
              </li>
              <p>
                جميع المحتويات المعروضة على الموقع، بما في ذلك النصوص، الصور،
                التصميمات، والشعارات، مملوكة لنا أو نستخدمها بموجب ترخيص. لا
                يجوز نسخها أو إعادة استخدامها دون إذن كتابي مسبق.
              </p>
              <li className="text-sm py-2 text-[#27AAE1] font-bold">
                المسئولية
              </li>
              <p>
                نحن لا نتحمل أي مسؤولية عن أي خسائر أو أضرار قد تنتج عن استخدامك
                للموقع أو اعتمادك على أي من المعلومات المتاحة فيه.
              </p>
            </ul>
          </div>
        </div>
        <div className="w-1/2   " dir="ltr">
          <div className="relative ">
            <img src={sh1} className="md:w-3/4" />
            <div className="absolute translate-x-1/2 -translate-y-1/4">
              <img src={sh2} className="md:w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
