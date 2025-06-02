export const formatArabicTime = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  const isPM = hours >= 12;
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const timeString = `${hours}:${minutes} ${isPM ? 'مساءً' : 'صباحاً'}`;
  
  return timeString;
};

export const getRelativeTimeArabic = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'الآن';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    if (diffInMinutes === 1) {
      return 'منذ دقيقة واحدة';
    }
    if (diffInMinutes === 2) {
      return 'منذ دقيقتين';
    }
    if (diffInMinutes >= 3 && diffInMinutes <= 10) {
      return `منذ ${diffInMinutes} دقائق`;
    }
    return `منذ ${diffInMinutes} دقيقة`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    if (diffInHours === 1) {
      return 'منذ ساعة واحدة';
    }
    if (diffInHours === 2) {
      return 'منذ ساعتين';
    }
    if (diffInHours >= 3 && diffInHours <= 10) {
      return `منذ ${diffInHours} ساعات`;
    }
    return `منذ ${diffInHours} ساعة`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    if (diffInDays === 1) {
      return 'منذ يوم واحد';
    }
    if (diffInDays === 2) {
      return 'منذ يومين';
    }
    if (diffInDays >= 3) {
      return `منذ ${diffInDays} أيام`;
    }
  }
  
  return formatArabicTime(dateObj);
};
