import hero from "../../assets/hero.png";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";
import { useContext } from "react";
export default function Header() {
  const { userLogin } = useContext(AuthContext);
  return (
    <header
      className="bg flex justify-center items-center  bg-gray my-5 w-[95%] bg-gray-100 rounded-3xl"
      dir="rtl"
    >
      <div className="flex md:flex-row flex-col  items-center justify-between md:ps-32 px-5 md:gap-32 gap-10">
        <div className="w-full md:w-1/2">
          <h1 className="font-bold text-5xl text-darkGray my-5">
            حلول موثوقة تضمن لك
            <br />
            الراحة،
            <span className="text-[#27AAE1]"> الجودة، والسلامة. </span>
          </h1>
          <p className="text-lightGray text-sm  my-5 max-w-md">
            نقدم لك مجموعة متكاملة من الحلول والخدمات المصممة خصيصًا لتلبية جميع
            احتياجاتك في المنزل أو مكان العمل. بفضل فريقنا المتخصص وخبرتنا
            العميقة، نضمن تنفيذ الأعمال بأعلى معايير الجودة والكفاءة، مع التركيز
            على راحتك وسلامتك. نحن نؤمن أن الخدمة المتميزة تبدأ بفهم احتياجاتك
            وتقديم حلول موثوقة ومخصصة تحقق لك راحة البال.
          </p>
          <Link
            to="/ourservices"
            className="relative inline-block px-4 py-2 font-medium group"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#27AAE1] group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-lg" />
            <span className="absolute inset-0 w-full h-full rounded-lg bg-[#82d6f9a0] border-2 border-gray-200 group-hover:bg-[#77c5e6a0]" />
            <span className="relative text-white group-hover:text-white">
              شاهد خدماتنا
            </span>
          </Link>
        </div>
        <div className="w-full md:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="rounded-xl "
          >
            <img src={hero} className="w-[90%]" />
          </motion.div>
          <div className="absolute bg-[#8daebd] flex items-center flex-col justify-center mx-auto -translate-x-5 lg:-translate-x-20 pt-5 px-7 rounded-3xl -translate-y-1/2">
            <p className="text-white text-sm text-center font-bold">
              اكسب نقاط اضافية ووفر في مشترايتك القادمة
            </p>
            <Link
              to={userLogin ? `/rewards` : "/signin"}
              className=" my-5 relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[#3bc1fa] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
            >
              <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#27AAE1] group-hover:h-full" />
              <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                <svg
                  className="w-5 h-5 text-[#27AAE1]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
              <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                ابدأ الأن
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
