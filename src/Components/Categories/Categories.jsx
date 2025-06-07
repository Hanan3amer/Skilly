import {  useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Categories({ categories, userLogin }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    setFilteredResults(categories);
  }, [categories]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  function searchItem(inputValue) {
    setSearchInput(inputValue);
    if (searchInput !== "") {
      const filterd = categories.filter((item) => {
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(inputValue.toLowerCase());
      });
      setFilteredResults(filterd);
    } else {
      setFilteredResults(categories);
    }
  }
  return (
    <>
      <div className="container">
        <div className="w-full">
          <h1 className="text-[#27AAE1] font-bold text-2xl text-center my-10">
            ما الخدمة التي تبحث عنها؟
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchItem(searchInput);
            }}
            className="max-w-md mx-auto"
            dir="rtl"
          >
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                onChange={(e) => searchItem(e.target.value)}
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border outline-none  rounded-lg bg-gray-50 focus:ring-[#27AAE1] focus:border-[#27AAE1] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#27AAE1] dark:focus:border-[#27AAE1]"
                placeholder="ابحث عن الخدمه"
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-[#27AAE1] hover:bg-[#27AAE1] focus:ring-4 focus:outline-none focus:ring-[#27AAE1] font-medium rounded-lg text-sm px-4 py-2 dark:bg-[#27AAE1] dark:hover:bg-[#27AAE1]dark:focus:ring-[#27AAE1]"
              >
                بحث
              </button>
            </div>
          </form>
        </div>
        <div className="w-full my-5">
          <h2 className="text-[#27AAE1] font-bold text-2xl text-center py-5">
            كافة الخدمات الاحترافية التي تحتاجها
          </h2>
          <div className="row flex flex-wrap my-10">
            {searchInput.length > 1
              ? filteredResults?.map((category) => (
                  <div
                    key={category?.id}
                    className="sm:w-1/2 lg:w-1/4 mx-auto p-2"
                  >
                    <Link
                      to={
                        userLogin
                          ? `/categoriesdetails/${category.id}`
                          : "/signin"
                      }
                    >
                      <img
                        src={category?.img}
                        className="mx-auto border border-gray-200 rounded-lg shadow-sm w-[200px]"
                      />
                      <p className="text-center text-lg  py-5">
                        {category?.name}
                      </p>
                    </Link>
                  </div>
                ))
              : categories?.map((category) => (
                  <div
                    key={category?.id}
                    className="sm:w-1/2 lg:w-1/4 mx-auto p-2"
                  >
                    <Link
                      to={
                        userLogin
                          ? `/categoriesdetails/${category.id}`
                          : "/signin"
                      }
                    >
                      <img
                        src={category?.img}
                        className="mx-auto border border-gray-200 rounded-lg shadow-sm w-[200px]"
                      />
                      <p className="text-center text-lg  py-5">
                        {category?.name}
                      </p>
                    </Link>
                  </div>
                ))}
          </div>
        </div>
        <div className="flex justify-end px-20 my-10">
          <div
            className="bg-gray-300 p-5 rounded-md max-w-3xl text-right"
            dir="rtl"
          >
            <h5 className="font-bold py-2">ملحوظة:</h5>
            <p>
              إذا كنت بحاجة إلى تصميم خاص أو خدمة غير مذكورة هنا ، يمكنك تقديم
              طلب خدمة مخصص وسنلبي احتياجاتك بكل احترافية
              <Link to="/requestservice" className="text-[#27AAE1] underline">
                {" "}
                اضغط هنا{" "}
              </Link>{" "}
              لطلب خدمة
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
