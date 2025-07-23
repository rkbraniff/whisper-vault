import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function TwoFactor() {
  const nav = useNavigate();
  const [code, set] = useState('');
  const temp = sessionStorage.getItem('tempToken');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!temp) nav('/signin');
  }, [temp, nav]);

  const verify = useMutation({
    mutationFn: () => {
      console.log('Temp token:', temp);
      return fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${temp}`,
        },
        body: JSON.stringify({ code }),
      }).then(r => r.json());
    },
    onSuccess: ({ token, error }) => {
      if (token) {
        localStorage.setItem('jwt', token);
        sessionStorage.removeItem('tempToken');
        nav('/');
      } else {
        setError(error || 'Invalid code');
      }
    },
    onError: () => setError('Network error'),
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setError('');
        if (!/^\d{6}$/.test(code)) {
          setError('Enter a valid 6-digit code');
          return;
        }
        verify.mutate();
      }}
      className="max-w-xs mx-auto mt-24 flex flex-col gap-4"
    >
      <input
        type="text"
        pattern="\d{6}"
        inputMode="numeric"
        autoFocus
        placeholder="123 456"
        value={code}
        onChange={e => set(e.target.value.replace(/\D/g, ''))}
        maxLength={6}
        className="text-center text-2xl tracking-widest p-3 rounded"
      />
      <button
        type="submit"
        className="p-3 bg-ember text-obsidian rounded"
        disabled={verify.isPending}
      >
        {verify.isPending ? 'Verifying…' : 'Verify'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
