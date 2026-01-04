import { useState, FormEvent } from 'react';
import { signIn } from '../services/api';
import { setAuthData } from '../utils/auth';
import './SignIn.css';

interface SignInProps {
  onSignInSuccess: () => void;
  onSwitchToSignUp: () => void;
}

function SignIn({ onSignInSuccess, onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      // Simple hash for demo (in production, use proper hashing)
      const passwordHash = btoa(password);
      
      const response = await signIn({ email, passwordHash });
      
      // Store auth data with 7-day expiration
      setAuthData(response);
      
      onSignInSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              onClick={onSwitchToSignUp}
              className="link-button"
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

