import location from "../../assets/location.png";
import PropTypes from "prop-types";
const Location = ({ handleAllow }) => {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 transition-transform duration-700 ease-in-out translate-y-0">
      <div className="bg-white shadow-md rounded-b-xl max-w-xl w-full">
        <div className="flex flex-col items-center justify-center text-center gap-3 p-4">
          <div className="w-full">
            <img
              src={location}
              alt="Location access"
              className="w-1/2 mx-auto"
            />
          </div>
          <div className="w-full">
            <p className="font-bold text-black text-md mb-2">
              نحتاج إلى الوصول إلى موقعك الحالي لعرض المحتوى المناسب لك
            </p>
            <p className="font-bold text-black text-sm">
              هل ترغب في السماح بالوصول إلى موقعك؟
            </p>
            <button
              onClick={handleAllow}
              className="mx-auto text-center my-3 font-bold text-white bg-[#27AAE1] px-10 py-2 rounded-lg"
            >
              سماح
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
Location.propTypes = {
  handleAllow: PropTypes.func,
};
