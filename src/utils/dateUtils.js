// 有効期限の確認
export const isExpired = (expireDate) => {
  if (!expireDate) return false;
  
  let expire;
  if (expireDate.seconds) {
    expire = new Date(expireDate.seconds * 1000);
  } else {
    expire = new Date(expireDate);
  }
  
  const now = new Date();
  return expire < now;
};

// 日付をフォーマット
export const formatDate = (date) => {
  if (!date) return '-';
  
  let dateObj;
  if (date.seconds) {
    dateObj = new Date(date.seconds * 1000);
  } else {
    dateObj = new Date(date);
  }
  
  return dateObj.toLocaleDateString('ja-JP');
};

// 残り日数を計算
export const daysUntilExpiry = (expireDate) => {
  if (!expireDate) return null;
  
  let expire;
  if (expireDate.seconds) {
    expire = new Date(expireDate.seconds * 1000);
  } else {
    expire = new Date(expireDate);
  }
  
  const now = new Date();
  const diffTime = expire - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
