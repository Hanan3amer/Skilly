import i from "../../assets/i.png";
import x from "../../assets/x.png";
import z from "../../assets/z.png";
import paint from "../../assets/paint.png";
import d from "../../assets/d.png";
import r from "../../assets/r.png";
import de from "../../assets/de.png";
import clean from "../../assets/clean.png";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaRegHandshake } from "react-icons/fa6";
import { IoGiftOutline } from "react-icons/io5";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { RiHandCoinFill } from "react-icons/ri";
import { FaScrewdriverWrench } from "react-icons/fa6";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaLaptop, FaThLarge, FaStar, FaClock } from "react-icons/fa";
import { AuthContext } from "../../Context/Authcontext";
import Header from "../Header/Header";

export default function Home() {
  const { userLogin } = useContext(AuthContext);
  const features = [
    {
      icon: <FaLaptop size={40} className="text-[#27AAE1] mx-auto" />,
      title: "سهولة الوصول",
      description:
        "يمكنك طلب خدماتنا بسهولة من خلال الموقع أو البرنامج الخاص بنا",
    },
    {
      icon: (
        <FaScrewdriverWrench size={40} className="text-[#27AAE1] mx-auto" />
      ),
      title: "الدعم والمساعدة",
      description:
        "نحن معك دائما في كل وقت لتقديم الدعم الفني والمساعدة من أجل نمو أعمالك وتطوير خدماتك",
    },
    {
      icon: <FaThLarge size={40} className="text-[#27AAE1] mx-auto" />,
      title: "تنوع الخدمات",
      description:
        "نوفر لكم مجموعة واسعة من الخدمات المتنوعة التي تلبي جميع احتياجاتكم، بدءًا من التصميم والتنفيذ وحتى الإصلاحات والصيانة وغيرها",
    },
    {
      icon: <FaStar size={40} className="text-[#27AAE1] mx-auto" />,
      title: "الاحترافية والخبرة",
      description:
        "فريقنا مدرب ومؤهل لتقديم أفضل الحلول بشكل احترافي ومتميز، والالتزام بأعلى معايير الاحترافية في كل خطوة من خطوات العمل لضمان تقديم خدمات أرقى إلى عملائنا",
    },
    {
      icon: <FaClock size={40} className="text-[#27AAE1] mx-auto" />,
      title: "الالتزام بالمواعيد",
      description:
        "نحن نلتزم بتسليم المشاريع في الوقت المحدد بكل دقة واحترافية، ونعتمد دائماً على التخطيط الجيد ومتابعة التنفيذ لضمان التسليم في الوقت المطلوب دون أي تأخير",
    },
    {
      icon: <RiHandCoinFill size={40} className="text-[#27AAE1] mx-auto" />,
      title: "الأسعار التنافسية",
      description:
        "نقدم خدماتنا بجودة عالية وأسعار تناسب جميع الميزانيات، حيث نحرص على تحقيق أفضل قيمة مقابل التكلفة لصالح عملائنا",
    },

    {
      icon: (
        <IoShieldCheckmarkOutline
          size={40}
          className="text-[#27AAE1] mx-auto"
        />
      ),
      title: " الموثوقية",
      description:
        "خدمات موثوقة من مقدمي خدمة معتمدين.نتعامل فقط مع مقدمي خدمات تم التحقق من هويتهم وخبرتهم لضمان أعلى درجات الاحترافية والأمان في كل طلب",
    },
    {
      icon: <IoGiftOutline size={40} className="text-[#27AAE1] mx-auto" />,
      title: " نقاط المكافآت",
      description:
        "احصل على نقاط مع كل خدمة طلبتها عبر موقعنا، واستبدلها بخصومات حصرية علي الخدمات الاخري . ووفّر على كل طلب!",
    },
    {
      icon: <FaRegHandshake size={40} className="text-[#27AAE1] mx-auto" />,
      title: " تفاوض السعر",
      description:
        "تفاوض على السعر قبل تأكيد الطلب امنحك الحرية في مناقشة السعر مع مقدم الخدمة قبل الدفع، لتحقيق أفضل قيمة ممكنة.",
    },
  ];
  const popularWorks = [
    { img: clean, title: "  تنظيف مكان عمل" },
    { img: i, title: "  تصميم غرفة معيشة" },
    { img: x, title: "إصلاح الأعطال الكهربائية" },
    { img: z, title: " تحديد وإصلاح المشاكل البرمجية في التطبيقات أو المواقع" },
    { img: paint, title: "دهانات الواجهات الخارجية" },
    { img: d, title: "توصيل الطلبات المنزلية" },
    { img: r, title: "اصلاح الأعطال وتركيب المحابس " },
    { img: de, title: "تزيين الحدائق والشرفات" },
  ];
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get(`https://skilly.runasp.net/api/Category/getAllCategories`)
      .then((apiResponse) => {
        setCategories(apiResponse.data.categories.slice(0, 4));
      })
      .catch((apiError) => {
        console.log(apiError);
      });
  }, []);
  function SampleNextArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 right-[-50px] transform -translate-y-1/2 border border-gray-800 text-gray-800 p-1 rounded-full  "
        onClick={onClick}
      >
        <ChevronRight size={20} />
      </button>
    );
  }
  SampleNextArrow.propTypes = {
    onClick: PropTypes.func,
  };
  function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 left-[-50px] transform -translate-y-1/2 border border-gray-800 text-gray-800 p-1 rounded-full  "
        onClick={onClick}
      >
        <ChevronLeft size={20} />
      </button>
    );
  }
  SamplePrevArrow.propTypes = {
    onClick: PropTypes.func,
  };
  var settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="my-20 xl:my-32">
        <section className="text-center container mx-auto">
          <div className="my-10">
            <h2 className="text-[#27AAE1] font-bold text-2xl">الخدمات</h2>
            <p>نقدم خدمات متنوعة تلبي احتياجاتك بدقة واحترافية</p>
          </div>
          <div className="max-w-xs md:max-w-5xl relative overflow-hidden text-center mx-auto px-20">
            <Slider {...settings}>
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    to={
                      userLogin
                        ? `/categoriesdetails/${category.id}`
                        : "/signin"
                    }
                  >
                    <figure className="px-1">
                      <img
                        className="h-auto max-w-full rounded-lg mx-auto"
                        src={category.img}
                        alt={category.name}
                      />
                      <figcaption className="mt-2 text-sm text-center text-black dark:text-gray-400">
                        {category.name}
                      </figcaption>
                    </figure>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
          <Link to="/categories">
            <button className="my-5 bg-[#27AAE1] text-white px-5 py-2 rounded-lg">
              استعراض جميع الخدمات
            </button>
          </Link>
        </section>
        <section className="container">
          <h2 className="text-[#27AAE1] font-bold text-3xl my-20 text-center">
            الأعمال الأكثر طلبًا
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            dir="rtl"
          >
            {popularWorks.map((work, index) => (
              <div key={index} className=" rounded-lg p-4 bg-gray-200">
                <img
                  src={work.img}
                  alt={work.title}
                  className="rounded-lg w-full h-40 object-cover"
                />
                <h3 className="text-sm font-bold text-gray-700 text-center mt-3">
                  {work.title}
                </h3>
              </div>
            ))}
          </div>
        </section>
        <section className="container mx-auto text-center my-20">
          <h2 className="text-[#27AAE1] font-bold text-3xl my-10">
            المزايا الخاصة بنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 max-w-xs mx-auto"
              >
                {feature.icon}
                <h3 className="text-lg font-bold text-[#27AAE1] mt-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mt-2 text-sm font-semibold">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
