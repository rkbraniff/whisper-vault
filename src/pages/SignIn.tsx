import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

export default function SignIn() {
  const nav = useNavigate();
  const [form, set] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);

  const login = useMutation({
    mutationFn: () =>
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then(r => r.json()),
    onSuccess: (data) => {
      if (data.error === 'Please confirm your email before logging in.') {
        setShowResend(true);
        setError(data.error);
      } else if (data.status === '2fa_required') {
        sessionStorage.setItem('tempToken', data.tempToken);
        nav('/2fa');
      } else if (data.token) {
        localStorage.setItem('jwt', data.token);
        nav('/');
      } else if (data.error) {
        setError(data.error);
      }
    },
  });

  async function resendConfirmation() {
    await fetch('/api/auth/resend-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email }),
    });
    setError('Confirmation email resent.');
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setError('');
        login.mutate();
      }}
      className="space-y-4 max-w-sm mx-auto mt-16"
    >
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => set({ ...form, email: e.target.value })}
        className="w-full p-3 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => set({ ...form, password: e.target.value })}
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
  );
}
