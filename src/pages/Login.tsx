import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!email || !password) {
      setError('全ての項目を入力してください');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
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

        {/* ログインフォーム */}
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
          <div style={{ marginBottom: '32px' }}>
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
              autoComplete="current-password"
            />
          </div>

          {/* ログインボタン */}
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
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        {/* サインアップリンク */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '14px',
            color: '#888',
          }}
        >
          アカウントをお持ちでないですか？{' '}
          <Link
            to="/signup"
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
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
