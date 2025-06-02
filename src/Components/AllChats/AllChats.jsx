import React from "react";
import { Link } from "react-router-dom";
import user from "../../assets/userpic.jpg";
export default function AllChats() {
  return (
    <div className="container">
      <div className="header text-center my-10">
        <h1 className="text-[#27AAE1] text-2xl font-bold">المحادثات</h1>
      </div>
      <div className="border border-black max-w-xl mx-auto rounded-xl p-5 my-10">
        <form className=" mx-auto" dir="rtl">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <input
            type="search"
            id="default-search"
            className="block w-full p-2.5 ps-5 text-lg text-gray-900  outline-none  rounded-lg bg-gray-100  placeholder:text-black placeholder:font-semibold  dark:text-black "
            placeholder="بحث"
            required
          />
        </form>
        <div className="border-b " dir="rtl">
          <Link to="/chat">
            <div className="flex items-center  gap-5 my-5">
              <img src={user} className="w-16 rounded-full" />
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold">اسم المستخدم</h3>
                <p className="font-semibold text-xs text-gray-500">
                  الرسالة الرسالة الرسالة الرسالة الرسالة الرسالة الرسالة
                  الرسالة الرسالة
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
