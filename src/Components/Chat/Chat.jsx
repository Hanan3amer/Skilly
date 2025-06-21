export default function Chat() {
  return (
    <div className="container">
      <div className="border border-black max-w-xl mx-auto rounded-xl p-5 relative">
        <div className="bg-[#27AAE1] rounded-xl p-3 absolute top-0 w-full left-0 ">
          <h1 className="font-bold text-white text-2xl text-center">
            احمد ايمن
          </h1>
        </div>
        <h3 className="text-[#27AAE1] mt-14 text-center font-semibold">
          تم فتح النقاش مع حول
        </h3>
        <div
          className="border border-black my-5 rounded-lg p-3 bg-gray-100"
          dir="rtl"
        >
          <h4 className="font-bold text-sm text-[#4285F4] my-3">
            عمل غرفه نوم
          </h4>
          <p className="text-xs">
            مطلوب خدمه مطلوب خدمه مطلوب خدمه مطلوب خدمه مطلوب خدمه مطلوب خدمه
            مطلوب خدمه مطلوب خدمه مطلوب......
          </p>
          <div className="flex gap-3 items-center justify-between my-5 pl-5">
            <div className="flex gap-3 items-center justify-between my-5">
              <h5 className="text-[#23255B] font-bold font-xs">العروض</h5>
              <div className="rounded-full bg-[#23255B] text-white w-6 h-6 text-center">
                5
              </div>
            </div>
            <h4 className="font-bold text-[#27AAE1]">500 ج.م</h4>
          </div>
        </div>
        {/* <div className="flex items-start gap-2.5 my-5">
          <img className="w-10 h-10 rounded-full" src={user} alt="user image" />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white pl-3">
              احمد ايمن
            </span>
            <div className="flex flex-col w-full max-w-sm leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse"></div>
              <p className="text-xs font-normal py-2.5  dark:text-white text-gray-500">
                رساله رساله رساله رساله رساله رساله رساله رساله رساله رساله
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2.5" dir="rtl">
          <img className="w-10 h-10 rounded-full" src={user} alt="user image" />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-700 dark:text-white ps-3">
              محمد خالد
            </span>
            <div className="flex flex-col w-full max-w-sm leading-1.5 p-4 border-gray-200 bg-[#23255B] rounded-e-xl rounded-es-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse"></div>
              <p className="text-xs font-normal py-2.5  dark:text-white text-white">
                رساله رساله رساله رساله رساله رساله رساله رساله رساله رساله
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 my-5" dir="rtl">
          <img className="w-10 h-10 rounded-full" src={user} alt="user image" />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-gray-700 dark:text-white ps-3">
              محمد خالد
            </span>
            <div className="flex flex-col w-full  leading-1.5 p-4 border-gray-200 bg-[#27a9e141] rounded-e-xl rounded-es-xl ">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <img src={money} />
                  <p className="font-bold text-sm">عرض سعر</p>
                </div>
                <button className="bg-[#23255B] text-white rounded-lg px-5 py-2">
                  عرض
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
