import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';

const Signup: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!nickname || !email || !password || !confirmPassword) {
      setError('全ての項目を入力してください');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で設定してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    // メールアドレスの形式チェック（簡易）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('メールアドレスの形式が正しくありません');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signUp(email, password, nickname);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* ロゴ・タイトル */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '900',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            MAYURIN
          </h1>
          <p style={{ fontSize: '16px', color: '#888' }}>
            YOUR RUNNING TRACKER
          </p>
        </div>

        {/* サインアップフォーム */}
        <form onSubmit={handleSubmit}>
          {/* エラーメッセージ */}
          {error && (
            <div
              style={{
                backgroundColor: '#ff4444',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* ニックネーム */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="nickname"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="まゆりん"
              required
              autoComplete="name"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #333',
                borderRadius: '28px',
                backgroundColor: '#000',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333';
              }}
            />
          </div>

          {/* メールアドレス */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #333',
                borderRadius: '28px',
                backgroundColor: '#000',
                color: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333';
              }}
            />
          </div>

          {/* パスワード */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {/* パスワード確認 */}
          <div style={{ marginBottom: '32px' }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {/* サインアップボタン */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#000',
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '28px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? '登録中...' : '新規登録'}
          </button>
        </form>

        {/* ログインリンク */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '14px',
            color: '#888',
          }}
        >
          既にアカウントをお持ちですか？{' '}
          <Link
            to="/login"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ccc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
