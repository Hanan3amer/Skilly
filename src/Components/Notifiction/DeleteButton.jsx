import PropTypes from "prop-types";

const DeleteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="h-full w-full bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
      aria-label="حذف"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
};
DeleteButton.propTypes = {
  onClick: PropTypes.func,
};
export default DeleteButton;
