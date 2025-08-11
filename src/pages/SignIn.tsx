
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const nav = useNavigate();
  const { login: setAuth } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAMethod, setTwoFAMethod] = useState<'totp' | 'sms' | null>(null);
  const [smsSent, setSmsSent] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

  // Helper to reset 2FA state
  function reset2FA() {
    setShow2FA(false);
    setTempToken('');
    setTwoFACode('');
    setTwoFAMethod(null);
    setSmsSent(false);
    setSmsLoading(false);
  }
  const login = useMutation({
    mutationFn: () =>
      import('../api/api').then(({ apiFetch }) =>
        apiFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      ).then(r => r.json()),
    onSuccess: (data) => {
      if (data.error === 'Please confirm your email before logging in.') {
        setShowResend(true);
        setError(data.error);
      } else if (data.status === '2fa_required') {
        setTempToken(data.tempToken);
        setShow2FA(true);
        setError('');
      } else if (data.token && data.user) {
        setAuth(data.token, data.user);
        nav('/');
      } else if (data.error) {
        setError(data.error);
      }
    },
  });

  const verify2FA = useMutation({
    mutationFn: () => {
      console.log('2FA tempToken:', tempToken);
      if (twoFAMethod === 'sms') {
        return import('../api/api').then(({ apiFetch }) =>
          apiFetch('/api/auth/2fa/verify-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tempToken}` },
            body: JSON.stringify({ code: twoFACode }),
          })
        ).then(r => r.json());
      } else {
        return import('../api/api').then(({ apiFetch }) =>
          apiFetch('/api/auth/2fa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tempToken}` },
            body: JSON.stringify({ code: twoFACode }),
          })
        ).then(r => r.json());
      }
    },
    onSuccess: (data) => {
      if (data.token && data.user) {
        setAuth(data.token, data.user);
        nav('/');
      } else if (data.error) {
        setError(data.error);
      }
    },
  });

  async function sendSmsCode() {
    setSmsLoading(true);
    setError('');
    const { apiFetch } = await import('../api/api');
    const res = await apiFetch('/api/auth/2fa/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tempToken}` },
    });
    setSmsLoading(false);
    if (res.ok) {
      setSmsSent(true);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to send SMS code');
    }
  }

  async function resendConfirmation() {
    const { apiFetch } = await import('../api/api');
    await apiFetch('/api/auth/resend-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }),
    });
    setError('Confirmation email resent.');
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto mt-16">
      {!show2FA ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            setError('');
            reset2FA(); // Always reset 2FA state when logging in
            login.mutate();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 rounded"
            minLength={8}
            required
          />
          <button
            type="submit"
            className="w-full bg-violetDeep text-white p-3 rounded"
            disabled={login.isPending}
          >
            {login.isPending ? 'Signing in…' : 'Sign In'}
          </button>
          {showResend && (
            <button
              type="button"
              className="w-full bg-gray-700 text-white p-3 rounded"
              onClick={resendConfirmation}
            >
              Resend Confirmation Email
            </button>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <div className="space-y-4">
          {!twoFAMethod && (
            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-violetDeep text-white p-3 rounded"
                onClick={() => setTwoFAMethod('totp')}
              >
                Use Authenticator App
              </button>
              <button
                className="w-full bg-blue-600 text-white p-3 rounded"
                onClick={() => setTwoFAMethod('sms')}
              >
                Use Text Message (SMS)
              </button>
            </div>
          )}
          {twoFAMethod === 'totp' && (
            <form
              onSubmit={e => {
                e.preventDefault();
                setError('');
                verify2FA.mutate();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter 2FA code from app"
                value={twoFACode}
                onChange={e => setTwoFACode(e.target.value)}
                className="w-full p-3 rounded"
                maxLength={6}
                required
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-violetDeep text-white p-3 rounded"
                disabled={verify2FA.isPending}
              >
                {verify2FA.isPending ? 'Verifying…' : 'Verify 2FA'}
              </button>
              <button
                type="button"
                className="w-full bg-gray-700 text-white p-3 rounded"
                onClick={() => setTwoFAMethod(null)}
              >
                Use a different method
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          )}
          {twoFAMethod === 'sms' && (
            <form
              onSubmit={e => {
                e.preventDefault();
                setError('');
                verify2FA.mutate();
              }}
              className="space-y-4"
            >
              {!smsSent ? (
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white p-3 rounded"
                  onClick={sendSmsCode}
                  disabled={smsLoading}
                >
                  {smsLoading ? 'Sending…' : 'Send SMS Code'}
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter code from SMS"
                    value={twoFACode}
                    onChange={e => setTwoFACode(e.target.value)}
                    className="w-full p-3 rounded"
                    maxLength={6}
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded"
                    disabled={verify2FA.isPending}
                  >
                    {verify2FA.isPending ? 'Verifying…' : 'Verify SMS Code'}
                  </button>
                  <button
                    type="button"
                    className="w-full bg-gray-700 text-white p-3 rounded"
                    onClick={() => { setTwoFAMethod(null); setSmsSent(false); setTwoFACode(''); }}
                  >
                    Use a different method
                  </button>
                </>
              )}
              {error && <p className="text-red-500">{error}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
