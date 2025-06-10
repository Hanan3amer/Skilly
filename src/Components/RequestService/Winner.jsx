import { GiStarsStack } from "react-icons/gi";
import PropTypes from "prop-types";

function Winner({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="relative p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700 p-6 text-center">
          <div className="mb-4">
            <div className="inline-block rounded-full bg-gray-100 p-6">
              <GiStarsStack className="w-16 h-16 text-yellow-500" />
            </div>
          </div>
          <h3 className="text-yellow-500 font-bold text-lg mb-2">+20 نقطة</h3>
          <h4 className="mb-5 text-md font-bold text-gray-500 dark:text-gray-400">
            !لقد حصلت على نقاط مقابل شراءك الخدمة
          </h4>
          <p className="text-gray-500 font-normal text-md my-3">
            استخدم نقاطك التي حصلت عليها لشراء المزيد من الخدمات
          </p>
          <button
            onClick={onClose}
            className="bg-[#27AAE1] text-white font-bold rounded-lg px-10 py-2"
          >
            جمع النقاط
          </button>
        </div>
      </div>
    </div>
  );
}
Winner.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default Winner;
