import { useState, useEffect } from 'react';
import { settingsService } from '../services/firestore';

const AdminSettings = () => {
  const [balance, setBalance] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings) {
        setBalance(settings.balance || '');
        if (settings.issuedAt) {
          setIssuedDate(new Date(settings.issuedAt.seconds * 1000).toISOString().split('T')[0]);
        }
        if (settings.expireAt) {
          setExpireDate(new Date(settings.expireAt.seconds * 1000).toISOString().split('T')[0]);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!balance || !issuedDate || !expireDate) {
      setError('全ての項目を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await settingsService.setSettings({
        balance: parseInt(balance),
        issuedAt: issuedDate,
        expireAt: expireDate
      });
      alert('残高が設定されました！');
    } catch (error) {
      setError('設定の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('本当にリセットしますか？')) {
      try {
        setLoading(true);
        await settingsService.updateBalance(10000);
        setBalance('10000');
        alert('残高をリセットしました！');
      } catch (error) {
        setError('リセットに失敗しました');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        💰 残高設定
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            残高（円）
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="10000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            発行日
          </label>
          <input
            type="date"
            value={issuedDate}
            onChange={(e) => setIssuedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            有効期限
          </label>
          <input
            type="date"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? '保存中...' : '設定を保存'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            残高をリセット（10,000円）
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
