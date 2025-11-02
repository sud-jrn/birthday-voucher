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
  
  // Firestore Timestamp オブジェクトの場合
  if (date.seconds && date.nanoseconds !== undefined) {
    dateObj = new Date(date.seconds * 1000);
  }
  // 文字列の場合
  else if (typeof date === 'string') {
    dateObj = new Date(date);
  }
  // Date オブジェクトの場合
  else if (date instanceof Date) {
    dateObj = date;
  }
  // その他の場合
  else {
    dateObj = new Date(date);
  }
  
  // NaNチェック
  if (isNaN(dateObj.getTime())) {
    return '-';
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
