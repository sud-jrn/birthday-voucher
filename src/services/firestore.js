import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Settings関連の操作
export const settingsService = {
  // 残高設定を取得
  async getSettings() {
    try {
      const settingsRef = doc(db, 'settings', 'current');
      const snapshot = await getDoc(settingsRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  },

  // 残高設定を作成・更新
  async setSettings(data) {
    try {
      const settingsRef = doc(db, 'settings', 'current');
      await setDoc(settingsRef, {
        ...data,
        year: new Date().getFullYear(),
        balance: parseInt(data.balance),
        issuedAt: serverTimestamp(),
        expireAt: data.expireAt || null
      });
    } catch (error) {
      console.error('Error setting settings:', error);
      throw error;
    }
  },

  // 残高を更新
  async updateBalance(newBalance) {
    try {
      const settingsRef = doc(db, 'settings', 'current');
      await updateDoc(settingsRef, {
        balance: parseInt(newBalance),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }
};

// Purchases関連の操作
export const purchasesService = {
  // 全ての購入履歴を取得
  async getAllPurchases() {
    try {
      const purchasesRef = collection(db, 'purchases');
      const q = query(purchasesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting purchases:', error);
      throw error;
    }
  },

  // 購入履歴を追加
  async addPurchase(data) {
    try {
      const purchasesRef = collection(db, 'purchases');
      await addDoc(purchasesRef, {
        ...data,
        price: parseInt(data.price),
        date: data.date || new Date().toISOString(),
        year: new Date().getFullYear(),
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding purchase:', error);
      throw error;
    }
  },

  // 購入履歴を削除
  async deletePurchase(id) {
    try {
      const purchaseRef = doc(db, 'purchases', id);
      await deleteDoc(purchaseRef);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    }
  },

  // 購入履歴を更新
  async updatePurchase(id, data) {
    try {
      const purchaseRef = doc(db, 'purchases', id);
      await updateDoc(purchaseRef, {
        ...data,
        price: parseInt(data.price),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  }
};
