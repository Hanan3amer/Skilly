export default function DeleteModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000005c] bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm text-center space-y-6">
        <h1 className="text-[#3B9DD2] font-bold text-3xl">SKILLY</h1>
        <p className="text-[#151F6D] text-lg font-semibold">
          هل انت متأكد من حذف الحساب؟
        </p>
        <div className="flex justify-around">
          <button
            onClick={onCancel}
            className="bg-[#151F6D] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
          >
            لا
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#3B9DD2] text-white px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90"
          >
            نعم
          </button>
        </div>
      </div>
    </div>
  );
}
