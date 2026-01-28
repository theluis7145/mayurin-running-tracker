import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { loadProfile, saveProfile } from '../utils/storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    nickname: 'ランナー',
  });

  // 初期ロード
  useEffect(() => {
    const loaded = loadProfile();
    if (loaded) {
      setProfile(loaded);
    }
  }, []);

  // ニックネームを更新
  const updateNickname = (nickname: string) => {
    const updated = { ...profile, nickname };
    setProfile(updated);
    saveProfile(updated);
  };

  // アバターを更新
  const updateAvatar = (avatarBase64?: string) => {
    const updated = { ...profile, avatarBase64 };
    setProfile(updated);
    saveProfile(updated);
  };

  return {
    profile,
    updateNickname,
    updateAvatar,
  };
}
