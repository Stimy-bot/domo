import { useCallback, useEffect, useState } from 'react';

export const useOtpVerification = (phone: string) => {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Countdown Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 2. Fetch Wrapper Helper
  const sendRequest = async (url: string, body: object) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.VITE_API_URL ?? ''}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A network error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Action Handlers
  const handleVerify = async (code: string) => {
    try {
      await sendRequest('/auth/otp/verify', { phone, code });
      setIsSuccess(true);
    } catch {
      /* Error handled in sendRequest */
    }
  };

  const handleResend = useCallback(async () => {
    if (!canResend) return;
    try {
      await sendRequest('/auth/otp/resend', { phone });
      setTimer(60);
      setCanResend(false);
    } catch {
      /* Error handled in sendRequest */
    }
  }, [phone, canResend]);

  const resetStatus = () => setError(null);

  return { handleVerify, handleResend, resetStatus, isLoading, error, isSuccess, timer, canResend };
};
