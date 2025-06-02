import phone from "../../assets/hero.png";
import { motion } from "framer-motion";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
export default function Header() {
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
          <Link to="/categories">
            <button
              type="button"
              className="flex items-center gap-2 text-white hover:bg-white hover:text-[#27AAE1] bg-[#27AAE1] focus:outline-none  rounded-2xl text-sm px-5 py-3 text-center cursor-pointer my-10 "
            >
              شاهد خدماتنا <CiLocationArrow1 className="text-xl" />
            </button>
          </Link>
        </div>
        <div className="w-full md:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="rounded-xl "
          >
            <img src={phone} className="w-[90%]" />
          </motion.div>
          <div className="absolute bg-[#8daebd] flex items-center flex-col justify-center mx-auto -translate-x-20 pt-5 px-7 rounded-3xl -translate-y-1/2">
            <p className="text-white font-bold">
              اكسب نقاط اضافية ووفر في مشترايتك القادمة
            </p>
            <Link to="/rewards">
              <button
                type="button"
                className="flex items-center gap-2 text-white hover:bg-white hover:text-[#27AAE1] bg-[#27AAE1] focus:outline-none  rounded-2xl text-sm px-5 py-3 text-center cursor-pointer my-5"
              >
                <MdOutlineKeyboardDoubleArrowRight className="text-xl" />
                ابدأ الان{" "}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
