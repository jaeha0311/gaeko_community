'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface UsernameSetupProps {
  onSave: (username: string) => Promise<void>;
  loading?: boolean;
}

export function UsernameSetup({ onSave, loading }: UsernameSetupProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('사용자명을 입력해주세요');
      return;
    }

    if (username.length < 3) {
      setError('사용자명은 3자 이상이어야 합니다');
      return;
    }

    if (username.length > 20) {
      setError('사용자명은 20자 이하여야 합니다');
      return;
    }

    // Username validation (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능합니다');
      return;
    }

    try {
      setError('');
      await onSave(username);
    } catch (err) {
      if (err instanceof Error && err.message.includes('unique')) {
        setError('이미 사용 중인 사용자명입니다');
      } else {
        setError('사용자명 설정 중 오류가 발생했습니다');
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-32 h-32 rounded-full bg-orange-100 mb-4 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl">👤</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        사용자명을 설정해주세요
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        다른 사용자들이 당신을 찾을 수 있도록 사용자명을 설정해주세요
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            placeholder="사용자명을 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg"
            disabled={loading}
            maxLength={20}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5 mr-2" />
          {loading ? '설정 중...' : '사용자명 설정'}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>• 사용자명은 3-20자 사이여야 합니다</p>
        <p>• 영문, 숫자, 언더스코어(_)만 사용 가능합니다</p>
        <p>• 나중에 언제든지 변경할 수 있습니다</p>
      </div>
    </div>
  );
} 