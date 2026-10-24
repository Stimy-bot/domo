import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const accountSid = process.env['TWILIO_ACCOUNT_SID'] || '';
const authToken = process.env['TWILIO_AUTH_TOKEN'] || '';
const verifyServiceSid = process.env['TWILIO_VERIFY_SERVICE_SID'] || '';

// Normalize the config flag to boolean
const useMock = String(process.env['SMS_MOCK'] || '').toLowerCase() === 'true';

// Safety: never allow mock in production
const isProd = String(process.env['NODE_ENV'] || '').toLowerCase() === 'production';
const allowMock = useMock && !isProd;

if (!accountSid || !authToken || !verifyServiceSid) {
  console.warn(
    '[Twilio] credentials or service SID missing. Using mock only if SMS_MOCK=true and NODE_ENV!=production.',
  );
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

function normalizePhone(phone: string) {
  if (!phone) return phone;
  return phone.startsWith('+') ? phone : `+${phone}`;
}

export const startVerification = async (phone: string) => {
  const to = normalizePhone(phone);
  if (allowMock) {
    console.info('[Twilio Mock] startVerification for', to, '-> mock pending');
    return { sid: 'mock-sid', status: 'pending' };
  }
  if (!client) {
    throw new Error('Twilio client not configured');
  }
  return client.verify.v2.services(verifyServiceSid).verifications.create({ to, channel: 'sms' });
};

export const checkVerification = async (phone: string, otp: string | number) => {
  const to = normalizePhone(phone);
  const code = String(otp ?? '');
  if (allowMock) {
    console.info('[Twilio Mock] checkVerification for', to, 'code', code);
    // Accept exactly 123456 as approved in mock mode
    if (code === '123456') return { status: 'approved' };
    return { status: 'pending' };
  }
  if (!client) {
    throw new Error('Twilio client not configured');
  }
  return client.verify.v2.services(verifyServiceSid).verificationChecks.create({ to, code });
};
