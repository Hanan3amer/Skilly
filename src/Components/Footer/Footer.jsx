import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
export default function Footer() {
  return (
    <footer className="rounded-t-lg shadow-sm bg-[#052A59]  w-full end-0 bottom-0 ">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex flex-col items-center">
              <img src={logo} className="h-20 me-3" alt="Skilly Logo" />
            </Link>
            <p className="text-white text-center">
              ! حلولاً مبتكرة تجعل حياتك أسهل وأفضل{" "}
            </p>
          </div>
          <div
            className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3"
            dir="rtl"
          >
            <div>
              <h2 className="mb-6 text-lg font-bold  uppercase text-[#27AAE1]">
                عن Skilly
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-4">
                  <Link to="/aboutus" className="hover:underline">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link to="/contactus" className="hover:underline">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-bold text-[#27AAE1] uppercase ">
                خدمه العملاء
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-4">
                  <Link to="/terms" className="hover:underline ">
                    الشروط والاحكام
                  </Link>
                </li>
                <li>
                  <Link to="/praivcy" className="hover:underline">
                    سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-bold text-[#27AAE1] uppercase ">
                الخدمات
              </h2>
              <div className="flex">
                <ul className="text-white font-medium">
                  <li className="mb-4">
                    <Link to="/ourservices" className="hover:underline">
                      البرمجه
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/ourservices" className="hover:underline">
                      الديكور
                    </Link>
                  </li>
                  <li>
                    <Link to="/ourservices" className="hover:underline">
                      خدمات أخرى
                    </Link>
                  </li>
                </ul>
                <ul className="text-white font-medium">
                  <li className="mb-4">
                    <Link to="/ourservices" className="hover:underline">
                      النجاره
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/ourservices" className="hover:underline">
                      الكهرباء
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-center text-center">
          <span className="text-sm text-white sm:text-center">
            © 2025"
            <Link to="/" className="hover:underline">
              Skilly™
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
