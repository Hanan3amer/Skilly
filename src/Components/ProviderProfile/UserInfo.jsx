import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useChat } from "../../Context/ChatContext";
const UserInfo = ({ user }) => {
  const { chatCount } = useChat();
  const navigate = useNavigate();
  const handleOpenMessages = () => {
    navigate("/messages");
  };
  const handleOpenEdit = () => {
    navigate("/serviceproviderdata?isEdit=true");
  };

  return (
    <section className="flex flex-col pr-8 pl-16 w-full max-md:px-5">
      <h1 className="self-center text-4xl font-bold leading-none text-center text-sky-500">
        الحساب الشخصي
      </h1>
      <div className="flex gap-2.5 self-end mt-12 max-md:mt-10">
        <div className="my-auto">
          <div className="flex gap-2.5 text-base leading-none text-black dark:text-white">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/35d9b5eba8cd4f58f5ad0c1f1ae03259416012479d024e6d66462a2fbe04aaf5?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
              className="object-contain shrink-0 aspect-square w-[25px]"
              alt="User icon"
            />
            <h2 className="grow shrink font-bold">
              {user?.firstName + " " + user?.lastName || "اسم المستخدم"}
            </h2>
          </div>
          <div className="flex flex-col  pl-7 mt-1.5 w-full text-sm whitespace-nowrap text-blue-950 dark:text-blue-200 max-md:pl-5">
            <div className="flex gap-1.5 self-end max-md:mr-2.5">
              <span>{user?.review || "0"}</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a335dbe69d831e0f85bef418a397e68b909260f13074c0caea1e32513668493?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                className="object-contain shrink-0 self-start aspect-square w-[18px]"
                alt="Star rating"
              />
            </div>
            <div className="flex justify-end mt-3 mr-2">
              <img
                src="/edit-icon.png"
                className="object-contain w-6 mr-2 cursor-pointer hover:opacity-80 transition-opacity"
                alt="Rating"
                onClick={handleOpenEdit}
              />
              <div className="relative">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/32baaa7284732c65dfbe9e008f7cb3949a3883f745d238bef60ede1319f186e1?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
                  alt="Badge"
                  className="object-contain aspect-square w-[30px] cursor-pointer hover:opacity-80 transition-opacity my-3"
                  onClick={handleOpenMessages}
                />
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#a4d7f5] border-2 border-white rounded-full -top-0 -end-3">
                  {chatCount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src={
            user?.img ||
            "https://cdn.builder.io/api/v1/image/assets/TEMP/c68cbdbfd3528a83a803a0e6abda1209635feebd7e206cc921b5d8f18180728b?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
          }
          className="object-cover shrink-0 max-w-full aspect-square w-[130px] max-md:w-[100px] max-sm:w-[80px] rounded-full"
          alt="Profile"
        />
      </div>
    </section>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    review: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    img: PropTypes.string,
  }),
};

UserInfo.defaultProps = {
  user: {},
};

export default UserInfo;
