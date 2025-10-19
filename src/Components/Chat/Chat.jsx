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
      </div>
    </div>
  );
}
