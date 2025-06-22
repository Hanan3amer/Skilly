import PropTypes from "prop-types";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { CiStar } from "react-icons/ci";

const ReviewCard = ({ serviceName, userName, userImage, feedback, rating }) => {
  return (
    <div className="w-full bg-sky-50 rounded-xl p-6">
      <div className="flex justify-between flex-row-reverse">
        <div className="text-sky-500 text-sm flex items-center font-bold">
          {serviceName || "غرفة معيشية"}
        </div>
        <div className="flex items-center gap-3 flex-row-reverse justify-start">
          <div className="flex flex-col items-start">
            <div className="font-semibold text-gray-900">
              {userName || "كريم عمر"}
            </div>
          </div>
          <img
            src={
              userImage ||
              "https://cdn.builder.io/api/v1/image/assets/TEMP/42b4dd3567b416fa17484e87d199c4c469070f73832ca08f0c0b5da31e673ac7"
            }
            alt={`${userName} profile`}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="mt-4 text-gray-800 text-right whitespace-pre-wrap">
        {feedback ||
          "وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل وصف العمل"}
      </div>
      <div className="mt-4 flex justify-end">
        <ReactStars
          count={5}
          value={rating || 3}
          edit={false}
          isHalf={true}
          activeColor="#FBBF24"
          color="#334155"
          size={24}
          emptyIcon={<CiStar />}
          halfIcon={<FaStarHalfAlt />}
          filledIcon={<FaStar />}
          classNames="flex gap-1"
          precision={0.25}
        />
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  serviceName: PropTypes.string,
  userName: PropTypes.string,
  userImage: PropTypes.string,
  feedback: PropTypes.string,
  rating: PropTypes.number,
};

export default ReviewCard;
