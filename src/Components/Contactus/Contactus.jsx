import c1 from "../../assets/c1.png";
import c2 from "../../assets/c2.png";
export default function Contactus() {
  return (
    <div className="container">
      <div
        className="flex items-center gap-10 md:gap-24  my-10 flex-col md:flex-row w-full"
        dir="rtl"
      >
        <div className="md:w-1/2 w-full">
          <h2 className="text-[#27AAE1] font-bold text-3xl my-3 p-5">
            تواصل معنا
          </h2>
          <div className="bg-[#E1F0F7]  p-5 rounded-lg">
            <p className="text-sm">
              نسعد بتواصلكم معنا ، ونرحب بأي استفسار أو ملاحظة أو اقتراح. لا
              تتردد في التواصل معنا عبر تعبئة الاستمارة التالية. إننا نقدر
              رسالتك وسنرد عليها في أقرب وقت ممكن.
            </p>

            <form className="max-w-sm my-5" dir="rtl">
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-bold text-gray-900  ps-2"
                >
                  الاسم
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-white outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5   "
                  placeholder=""
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-gray-900  ps-2"
                >
                  البريد الالكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-white outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5    "
                  placeholder=""
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-bold text-gray-900  ps-2"
                >
                  موضوع الرسالة
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-white outline-none text-gray-900 text-sm rounded-lg  block w-full p-2.5    "
                  placeholder=""
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold ps-2 text-gray-900 "
                >
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block rounded-lg p-2.5 w-full text-sm text-gray-900 bg-white outline-none"
                  defaultValue={""}
                />
              </div>
              <button className="bg-[#3B9DD2] text-white font-bold mx-auto  w-full text-center py-2 rounded-lg">
                ارسال
              </button>
            </form>
          </div>
        </div>
        <div className="w-1/2  mb-20 " dir="ltr">
          <div className="relative ">
            <img src={c1} className="md:w-3/4" />
            <div className="absolute translate-x-1/2 -translate-y-1/4">
              <img src={c2} className="md:w-3/4" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#E1F0F7] rounded-lg p-3 mx-auto my-20">
        <h3 className="text-[#27AAE1] font-bold md:text-xl text-sm  text-center ">
          لا تتردد في التواصل معنا والطلب من خدماتنا{" "}
        </h3>
      </div>
    </div>
  );
}
