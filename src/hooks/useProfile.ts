import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { saveUserProfile, subscribeToProfile } from '../utils/firestore';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    nickname: user?.displayName || 'ランナー',
  });
  const [loading, setLoading] = useState(true);

  // プロフィールのリアルタイム監視
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Firestoreからプロフィールをリアルタイム監視
    const unsubscribe = subscribeToProfile(user.uid, (firestoreProfile) => {
      if (firestoreProfile) {
        setProfile(firestoreProfile);
      } else {
        // Firestoreにプロフィールがない場合はデフォルト値を設定
        setProfile({
          nickname: user.displayName || 'ランナー',
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // ニックネームを更新
  const updateNickname = async (nickname: string) => {
    if (!user) return;

    const updated = { ...profile, nickname };
    setProfile(updated);
    await saveUserProfile(user.uid, updated);
  };

  // アバターを更新
  const updateAvatar = async (avatarBase64?: string) => {
    if (!user) return;

    const updated = { ...profile, avatarBase64 };
    setProfile(updated);
    await saveUserProfile(user.uid, updated);
  };

  return {
    profile,
    updateNickname,
    updateAvatar,
    loading,
  };
}
