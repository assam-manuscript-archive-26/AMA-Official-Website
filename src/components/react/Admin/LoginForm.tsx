import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogIn, Shield, Loader2 } from 'lucide-react';
import { login, isAuthenticated } from '../../../backend/actions/auth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      window.location.href = '/admin';
      return;
    }

    // Check for remembered email
    const savedEmail = localStorage.getItem('ama_remember_user');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        // Save remember-me preference
        if (rememberMe) {
          localStorage.setItem('ama_remember_user', email.trim());
        } else {
          localStorage.removeItem('ama_remember_user');
        }

        window.location.href = '/admin';
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Header with icon */}
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Shield size={28} />
          </div>
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">Sign in to manage the Assamese Manuscript Archive archive</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="login-input"
              disabled={isLoading}
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="admin-password">Password</label>
            <div className="login-input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="login-input login-input-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-password"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-remember">
            <label className="login-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="login-checkbox"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="login-spinner-icon" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="/" className="login-back-link">← Back to website</a>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          width: 100%;
          max-width: 420px;
          animation: loginSlideUp 0.5s ease-out;
        }

        @keyframes loginSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-card {
          background: var(--color-surface-card);
          border-radius: var(--radius-xl);
          padding: 40px 36px;
          border: 1px solid var(--color-hairline);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-primary);
          color: var(--color-on-primary);
          margin-bottom: 16px;
        }

        .login-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 600;
          color: var(--color-ink);
          margin: 0 0 8px 0;
          line-height: 1.1;
        }

        .login-subtitle {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-muted);
          margin: 0;
          line-height: 1.5;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: rgba(198, 69, 69, 0.08);
          border: 1px solid rgba(198, 69, 69, 0.2);
          color: var(--color-error);
          font-size: 13px;
          font-family: var(--font-body);
          margin-bottom: 24px;
          animation: loginShake 0.4s ease;
        }

        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-label {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-body);
          letter-spacing: 0.01em;
        }

        .login-input {
          width: 100%;
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink);
          background: var(--color-canvas);
          border: 1px solid var(--color-hairline);
          border-radius: var(--radius-md);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .login-input::placeholder {
          color: var(--color-muted-soft);
        }

        .login-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(204, 120, 92, 0.12);
        }

        .login-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-input-wrapper {
          position: relative;
        }

        .login-input-password {
          padding-right: 48px;
        }

        .login-toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .login-toggle-password:hover {
          color: var(--color-ink);
        }

        .login-remember {
          display: flex;
          align-items: center;
        }

        .login-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-muted);
          cursor: pointer;
          user-select: none;
        }

        .login-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--color-primary);
          cursor: pointer;
        }

        .login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 20px;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-on-primary);
          background: var(--color-primary);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          letter-spacing: 0.01em;
        }

        .login-submit:hover:not(:disabled) {
          background: var(--color-primary-active);
        }

        .login-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-spinner-icon {
          animation: loginSpin 1s linear infinite;
        }

        @keyframes loginSpin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--color-hairline);
        }

        .login-back-link {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .login-back-link:hover {
          color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}