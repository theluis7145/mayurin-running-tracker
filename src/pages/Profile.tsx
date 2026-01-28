import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { ProfileImagePicker } from '../components/ProfileImagePicker';

export function Profile() {
  const { profile, updateNickname, updateAvatar } = useProfile();
  const [nickname, setNickname] = useState(profile.nickname);

  const handleSave = () => {
    if (nickname.trim()) {
      updateNickname(nickname.trim());
      alert('Profile saved!');
    }
  };

  const handleImageSelect = (base64: string) => {
    updateAvatar(base64);
  };

  return (
    <div className="min-h-screen bg-black safe-bottom">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">PROFILE</h1>

        <div className="bg-gray-900 rounded-3xl p-8 space-y-8 border border-gray-800">
          {/* プロフィール画像 */}
          <ProfileImagePicker
            currentImage={profile.avatarBase64}
            onImageSelect={handleImageSelect}
          />

          {/* ニックネーム入力 */}
          <div>
            <label htmlFor="nickname" className="block text-xs font-bold text-gray-400 mb-3 tracking-wider">
              NICKNAME
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500"
              placeholder="Enter your nickname"
            />
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            className="w-full py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-150 tracking-wide"
          >
            SAVE PROFILE
          </button>
        </div>

        {/* 使い方説明 */}
        <div className="mt-8 bg-gray-900 rounded-3xl p-8 border border-gray-800">
          <h2 className="text-sm font-bold text-gray-400 mb-6 tracking-wider">
            ABOUT THIS APP
          </h2>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>GPSでランニングを記録</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>距離と時速を自動計算</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>ラップタイムを記録</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>地図で走行ルートを確認</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>過去の記録を閲覧</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
