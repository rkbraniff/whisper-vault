import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

async function resendConfirmation(email: string) {
  await fetch('/api/auth/resend-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export default function SignUp() {
  const [form, set] = useState({ email: '', password: '', confirm: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResend] = useState(false);

  const register = useMutation({
    mutationFn: () =>
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then(r => r.json()),
    onSuccess: ({ error, message, status }) => {
      if (error) setError(error);
      else if (status === 'confirmation_required') {
        setSuccess(message || 'Registration successful! Please check your email to confirm your account.');
      } else {
        setError('Unexpected response from server.');
      }
    },
  });

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-16 bg-obsidian-light/80 rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
        <div className="mb-4">{success}</div>
        <Link to="/signin" className="block text-center text-blue-400 hover:underline mb-2">
          Go to Sign In
        </Link>
        {showResend && (
          <button
            type="button"
            className="w-full bg-gray-700 text-white p-3 rounded"
            onClick={() => resendConfirmation(form.email)}
          >
            Resend Confirmation Email
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
          setError('Passwords do not match');
          return;
        }
        register.mutate();
      }}
      className="space-y-4 max-w-sm mx-auto mt-16"
    >
      <input
        type="text"
        placeholder="First Name"
        value={form.firstName}
        onChange={e => set({ ...form, firstName: e.target.value })}
        className="w-full p-3 rounded"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={form.lastName}
        onChange={e => set({ ...form, lastName: e.target.value })}
        className="w-full p-3 rounded"
        required
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={form.confirm}
        onChange={e => set({ ...form, confirm: e.target.value })}
        className="w-full p-3 rounded"
        minLength={8}
        required
      />
      <button
        type="submit"
        className="w-full bg-violetDeep text-white p-3 rounded"
        disabled={register.isPending}
      >
        {register.isPending ? 'Creating…' : 'Create Account'}
      </button>
      <Link to="/signin" className="block text-center text-blue-400 hover:underline">
        Already have an account? Sign In
      </Link>
      {(register.error || error) && <p className="text-red-500">Error: {error || 'email in use'}</p>}
    </form>
  );
}
