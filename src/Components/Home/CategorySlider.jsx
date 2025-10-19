import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function SampleNextArrow({ onClick }) {
  return (
    <button
      className="absolute top-1/2 right-[-50px] transform -translate-y-1/2 border border-gray-500 text-gray-800 p-1 rounded-full cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <ChevronRight size={20} />
    </button>
  );
}

function SamplePrevArrow({ onClick }) {
  return (
    <button
      className="absolute top-1/2 left-[-50px] transform -translate-y-1/2 border border-gray-500 text-gray-800 p-1 rounded-full cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </button>
  );
}

export default function CategorySlider({ categories, userLogin }) {
  const settings = {
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
    <section className="container mx-auto text-center my-20">
      <h2 className="text-[#27AAE1] font-bold text-3xl my-5">الخدمات</h2>
      <p>نقدم خدمات متنوعة تلبي احتياجاتك بدقة واحترافية</p>
      <div className="max-w-xs md:max-w-5xl relative overflow-hidden text-center mx-auto px-20 my-5">
        <Slider {...settings}>
          {categories?.slice(0, 4).map((category) => (
            <div key={category.id}>
              <Link
                to={userLogin ? `/categoriesdetails/${category.id}` : "/signin"}
              >
                <figure className="px-1">
                  <img
                    className="h-auto max-w-full rounded-lg mx-auto"
                    src={category.img}
                    alt={category.name}
                  />
                  <figcaption className="mt-2 text-sm text-center text-black ">
                    {category.name}
                  </figcaption>
                </figure>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      <Link to="/ourservices">
        <button className="my-5 bg-[#27AAE1] text-white px-5 py-2 rounded-lg cursor-pointer">
          استعراض جميع الخدمات
        </button>
      </Link>
    </section>
  );
}

CategorySlider.propTypes = {
  categories: PropTypes.array.isRequired,
  userLogin: PropTypes.bool,
};
