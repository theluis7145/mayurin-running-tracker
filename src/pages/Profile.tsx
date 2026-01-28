import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { ProfileImagePicker } from '../components/ProfileImagePicker';

export function Profile() {
  const { profile, updateNickname, updateAvatar } = useProfile();
  const [nickname, setNickname] = useState(profile.nickname);

  const handleSave = () => {
    if (nickname.trim()) {
      updateNickname(nickname.trim());
      alert('プロフィールを保存しました！');
    }
  };

  const handleImageSelect = (base64: string) => {
    updateAvatar(base64);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sun-50 pb-20">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-sky-800 mb-8">プロフィール設定</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* プロフィール画像 */}
          <ProfileImagePicker
            currentImage={profile.avatarBase64}
            onImageSelect={handleImageSelect}
          />

          {/* ニックネーム入力 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="あなたのニックネームを入力"
            />
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
          >
            保存する
          </button>
        </div>

        {/* 使い方説明 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            新機能
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>プロフィール画像をアップロードできるようになりました</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>走行記録が自動的に保存されます</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>完了時に励ましメッセージが表示されます</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>履歴画面で過去の記録を確認できます</span>
            </li>
          </ul>
        </div>

        {/* 使い方説明 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-sky-800 mb-4">使い方</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">1.</span>
              <span>ホーム画面でスタートボタンを押してランニングを開始</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">2.</span>
              <span>GPS許可を求められたら「許可」をクリック</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">3.</span>
              <span>走行ルートが地図に表示され、距離とペースが計算されます</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">4.</span>
              <span>ラップボタンで区間タイムを記録</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">5.</span>
              <span>一時停止後、終了ボタンで記録を保存</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">6.</span>
              <span>完了モーダルに励ましメッセージが表示されます</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-600 font-bold">7.</span>
              <span>履歴画面で過去の記録を確認・削除できます</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
