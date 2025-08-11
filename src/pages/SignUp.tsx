import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

interface FormState {
  email: string;
  password: string;
  confirm: string;
  firstName: string;
  lastName: string;
  phone: string;
}

function trimForm(f: FormState): FormState {
  return {
    ...f,
    email: f.email.trim(),
    firstName: f.firstName.trim(),
    lastName: f.lastName.trim(),
    phone: f.phone.trim(),
  };
}

export default function SignUp() {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirm: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResend, setShowResend] = useState(false);

  const register = useMutation({
    mutationFn: () =>
      import('../api/api').then(({ apiFetch }) =>
        apiFetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimForm(form)),
        })
      ).then(r => r.json()),
    onSuccess: ({ error, message, status }: any) => {
      if (error) {
        setError(error);
        return;
      }
      if (status === 'confirmation_required') {
        setSuccess(
          message ??
            'Registration successful! Please check your email to confirm your account.'
        );
        setShowResend(true);
      } else {
        setError('Unexpected response from server.');
      }
    },
    onError: () => setError('Network error, please try again.'),
  });

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-16 bg-obsidian-light/80 rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
        <p className="mb-4">{success}</p>
        <Link to="/signin" className="block text-violet-300 hover:underline mb-4">Go to Sign In</Link>
        {showResend && (
          <button
            onClick={() => {
              import('../api/api').then(({ apiFetch }) =>
                apiFetch('/api/auth/resend-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: form.email }),
                })
              );
              setShowResend(false);
            }}
            className="w-full bg-gray-700 text-white p-3 rounded"
          >Resend Confirmation Email</button>
        )}
      </div>
    );
  }

  return (
    <form
      className="space-y-4 max-w-sm mx-auto mt-16"
      onSubmit={e => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
          setError('Passwords do not match');
          return;
        }
        register.mutate();
      }}
    >
      <input type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full p-3 rounded" required />
      <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full p-3 rounded" required />
      <input type="tel" placeholder="Phone Number (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} pattern="[0-9\-\+\(\) ]*" className="w-full p-3 rounded" />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-3 rounded" required />
      <input type="password" placeholder="Password (min 8 chars)" minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-3 rounded" required />
      <input type="password" placeholder="Confirm Password" minLength={8} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="w-full p-3 rounded" required />
      <button type="submit" className="w-full bg-violetDeep text-white p-3 rounded" disabled={register.isPending}>
        {register.isPending ? 'Creating…' : 'Create Account'}
      </button>
      <Link to="/signin" className="block text-center text-violet-300 hover:underline">Already have an account? Sign In</Link>
      {error && <p className="text-red-500 pt-2">{error}</p>}
    </form>
  );
}
