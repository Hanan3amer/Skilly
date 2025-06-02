import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageUpload from "../ImageUpload/ImageUpload";
import VideoUpload from "../VideoUpload/VideoUpload";

const ServiceAddForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    notes: "",
    images: [],
    video: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleImageUpdate = (newImages) => {
    setFormData(prevData => ({
      ...prevData,
      images: newImages
    }));
  };

  const handleVideoUpdate = (videoFile) => {
    setFormData(prevData => ({
      ...prevData,
      video: videoFile
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "يرجى إدخال عنوان الخدمة";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "يرجى إدخال وصف الخدمة";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "يرجى إدخال السعر";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "السعر يجب أن يكون رقماً موجباً";
    }
    
    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = "يرجى إدخال مدة التسليم";
    } else if (isNaN(formData.deliveryTime) || Number(formData.deliveryTime) <= 0) {
      newErrors.deliveryTime = "مدة التسليم يجب أن تكون رقماً موجباً";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
      alert("تمت إضافة الخدمة بنجاح!");
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <main className="flex flex-col items-center p-3 w-full bg-white">
      <div className="w-full max-w-[1000px] mb-2 flex justify-between items-center">
        <Link 
          to="/profile" 
          className="flex items-center gap-1 px-3 py-1 text-sky-500 hover:text-sky-600 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>العودة</span>
        </Link>
        <h1 className="text-2xl font-bold text-sky-500">
          اضافة خدمة
        </h1>
      </div>
      
      <article className="p-5 w-full bg-white rounded-xl border border-black max-w-[1000px] shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col items-end">
          <div className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black text-right">عنوان الخدمه</h2>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="عمل غرفة معيشة"
              className={`p-4 w-full text-lg text-right text-black bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                errors.title ? 'border border-red-500' : ''
              }`}
              dir="rtl"
            />
            {errors.title && <p className="text-red-500 text-right mt-1">{errors.title}</p>}
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <h2 className="mb-2 text-xl font-bold text-black text-right">وصف الخدمه</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="تصميم بسيط ومريح يجمع بين الأناقة والعملية، مع ألوان متناغمة..."
                className={`p-4 w-full text-lg text-right text-black bg-gray-100 rounded-lg min-h-[100px] focus:outline-none focus:ring-1 focus:ring-sky-300 ${
                  errors.description ? 'border border-red-500' : ''
                }`}
                dir="rtl"
              />
              {errors.description && <p className="text-red-500 text-right mt-1">{errors.description}</p>}
            </div>
            
            <div>
              <h2 className="mb-2 text-xl font-bold text-black text-right">مدة التسليم</h2>
              <div className="flex justify-between items-center p-4 w-full bg-gray-100 rounded-lg">
                <input
                  type="text"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  placeholder="20"
                  className={`w-full text-lg text-left text-black bg-transparent focus:outline-none ${
                    errors.deliveryTime ? 'text-red-500' : ''
                  }`}
                />
                <span className="text-lg font-bold text-sky-500">يوم</span>
              </div>
              {errors.deliveryTime && <p className="text-red-500 text-right mt-1">{errors.deliveryTime}</p>}
            </div>
            
            <div>
              <h2 className="mb-2 text-xl font-bold text-black text-right">السعر</h2>
              <div className="flex justify-between items-center p-4 w-full bg-gray-100 rounded-lg">
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1200"
                  className={`w-full text-lg text-left text-black bg-transparent focus:outline-none ${
                    errors.price ? 'text-red-500' : ''
                  }`}
                />
                <span className="text-lg font-bold text-sky-500">ريال</span>
              </div>
              {errors.price && <p className="text-red-500 text-right mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black text-right">الملاحظات</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="1- يمكن استخدام أجود أنواع الخشب الطبيعي أو المعالج. 2- تلبية جميع الأنماط..."
              className="p-4 w-full text-lg text-right text-black bg-gray-100 rounded-lg min-h-[80px] focus:outline-none focus:ring-1 focus:ring-sky-300"
              dir="rtl"
            />
          </div>

          <section className="w-full mb-4">
            <h2 className="mb-2 text-xl font-bold text-black text-right">اضافة صور</h2>
            <ImageUpload onImagesUpdate={handleImageUpdate} />
          </section>

          <section className="w-full mb-5">
            <h2 className="mb-2 text-xl font-bold text-black text-right">اضافة فيديو</h2>
            <VideoUpload onVideoUpdate={handleVideoUpdate} />
          </section>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="text-xl font-bold text-white bg-sky-500 rounded-lg cursor-pointer py-2 px-6 hover:bg-sky-600 transition-colors"
            >
              اضافة الخدمة
            </button>
          </div>
        </form>
      </article>
    </main>
  );
};

export default ServiceAddForm;
