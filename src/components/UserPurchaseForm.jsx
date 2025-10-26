import { useState, useEffect } from 'react';
import { purchasesService, settingsService } from '../services/firestore';
import { isExpired } from '../utils/dateUtils';

const UserPurchaseForm = () => {
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await settingsService.getSettings();
      if (data) {
        setBalance(data.balance || 0);
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item || !price || !date) {
      setError('全ての項目を入力してください');
      return;
    }

    // 有効期限チェック
    if (settings && isExpired(settings.expireAt)) {
      setError('有効期限が切れています');
      return;
    }

    const priceNum = parseInt(price);
    if (priceNum <= 0) {
      setError('金額は1円以上を入力してください');
      return;
    }

    if (priceNum > balance) {
      setError('残高が不足しています');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await purchasesService.addPurchase({
        item,
        price: priceNum,
        date,
        note
      });
      
      // 残高を減算
      await settingsService.updateBalance(balance - priceNum);
      
      // フォームをリセット
      setItem('');
      setPrice('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // 残高を再読み込み
      await loadBalance();
      
      alert('購入内容を登録しました！');
    } catch (error) {
      setError('登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const expired = settings && isExpired(settings.expireAt);

  if (expired) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🛒 購入内容を登録
        </h2>
        <div className="text-center text-red-600 py-8">
          <p className="text-lg font-semibold">有効期限が切れています</p>
          <p className="text-sm mt-2">新しいお買い物券の発行をお待ちください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🛒 購入内容を登録
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            商品名
          </label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例: パン"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            金額（円）
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            日付
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモ（任意）
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例: コンビニで購入"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? '登録中...' : '登録'}
        </button>
      </form>
    </div>
  );
};

export default UserPurchaseForm;

