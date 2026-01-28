import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthUser } from '../types';
import { getAuthErrorMessage } from '../utils/authErrors';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase Userを内部のAuthUser型に変換
  const mapFirebaseUser = (firebaseUser: User | null): AuthUser | null => {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    };
  };

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // サインアップ
  const signUp = async (email: string, password: string, nickname: string) => {
    try {
      setError(null);
      setLoading(true);

      // Firebase Authenticationでユーザー作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // ユーザープロフィールを更新
      await updateProfile(firebaseUser, {
        displayName: nickname,
      });

      // Firestoreにユーザードキュメントを作成
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        nickname,
        email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: nickname,
      });
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // サインイン
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(mapFirebaseUser(userCredential.user));
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // サインアウト
  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // エラークリア
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
