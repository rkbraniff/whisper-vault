import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ConfirmEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const [qrImg, setQrImg] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No confirmation token provided.');
      return;
    }
    fetch(`/api/auth/confirm/${token}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setStatus('success');
          setMessage(data.message || 'Email confirmed! You may now log in.');
          setQrImg(data.qrImg || null);
          setManualCode(data.manualCode || null);
        } else {
          const err = await res.json();
          setStatus('error');
          setMessage(err.error || 'Invalid or expired confirmation token.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      });
  }, [token]);

  return (
    <div className="max-w-md w-full bg-obsidian-light/80 rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Email Confirmation</h2>
      {status === 'loading' && <div>Confirming your email...</div>}
      {status === 'success' && (
        <>
          <div className="text-green-500 mb-4">{message}</div>
          {qrImg && (
            <div className="mb-4">
              <div className="mb-2">
                Scan this QR code in your authenticator app:
              </div>
              <img
                src={qrImg}
                alt="2FA QR Code"
                className="mx-auto mb-2"
                style={{ maxWidth: 200 }}
              />
              {manualCode && (
                <div>
                  Or enter this code manually: <b>{manualCode}</b>
                </div>
              )}
            </div>
          )}
          <button
            className="mt-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
            onClick={() => navigate('/signin')}
          >
            Go to Sign In
          </button>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="text-red-500 mb-4">{message}</div>
          <button
            className="mt-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </>
      )}
    </div>
  );
}
