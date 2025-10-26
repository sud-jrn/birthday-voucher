import { useState, useEffect } from 'react';
import { settingsService } from '../services/firestore';
import { isExpired, daysUntilExpiry } from '../utils/dateUtils';

const UserBalance = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    // リアルタイム更新のため3秒ごとに再取得
    const interval = setInterval(loadSettings, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString('ja-JP');
    }
    return new Date(date).toLocaleDateString('ja-JP');
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
        残高情報がありません
      </div>
    );
  }

  const expired = isExpired(settings.expireAt);
  const daysLeft = daysUntilExpiry(settings.expireAt);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        💰 現在の残高
      </h2>
      {expired ? (
        <div className="text-3xl font-bold text-red-600 mb-4">
          有効期限切れ
        </div>
      ) : (
        <div className="text-5xl font-bold text-indigo-600 mb-4">
          ¥{settings.balance?.toLocaleString() || '0'}
        </div>
      )}
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">発行日:</span> {formatDate(settings.issuedAt)}
        </div>
        {settings.expireAt && (
          <div>
            <span className="font-medium">有効期限:</span> {formatDate(settings.expireAt)}
            {!expired && daysLeft !== null && (
              <span className="ml-2 text-orange-600">
                （残り{daysLeft}日）
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBalance;
