import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// シンプルな秘密のキー（実際の運用では環境変数などで管理）
const SECRET_KEY = 'birthday2025';

const AuthGuard = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const key = searchParams.get('key');
    
    // ローカルストレージで認証状態を保持
    const storedAuth = localStorage.getItem('isAuthorized');
    
    if (key === SECRET_KEY || storedAuth === 'true') {
      setAuthorized(true);
      localStorage.setItem('isAuthorized', 'true');
    } else {
      setError('認証が必要です');
    }
  }, [searchParams]);

  if (authorized) {
    return <>{children}</>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">🔒 認証が必要です</p>
          <p className="text-gray-600 text-sm">正しいURLでアクセスしてください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
};

export default AuthGuard;
