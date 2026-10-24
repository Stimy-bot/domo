// libs/services/src/lib/twilioService.ts
import type { FastifyBaseLogger } from 'fastify';
import Twilio from 'twilio';

const IS_MOCK = process.env['SMS_MOCK'] === 'true';
const MOCK_OTP = process.env['MOCK_OTP'] || '123456';

export interface VerificationCheckResult {
  status: string;
  valid: boolean;
}

/**
 * Helper to initialize Twilio Client with validation
 */
const getTwilioConfig = () => {
  const sid = process.env['TWILIO_ACCOUNT_SID']?.trim();
  const token = process.env['TWILIO_AUTH_TOKEN']?.trim();
  const serviceSid = process.env['TWILIO_VERIFY_SERVICE_SID']?.trim();

  if (!IS_MOCK && (!sid || !token || !serviceSid)) {
    throw new Error(
      'Twilio Configuration Missing: Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID are set.',
    );
  }

  return {
    client: !IS_MOCK && sid && token ? Twilio(sid, token) : null,
    serviceSid: serviceSid || '',
  };
};

/**
 * Sends a verification code via Twilio Verify
 */
export const sendVerificationCode = async (
  to: string,
  logger?: FastifyBaseLogger,
): Promise<string> => {
  const formattedTo = to.trim();

  if (IS_MOCK) {
    if (logger) {
      logger.info({ to: formattedTo, otp: MOCK_OTP }, '[MOCK SMS] Verification code generated');
    } else {
      console.log(`[MOCK SMS] To: ${formattedTo} | Otp: ${MOCK_OTP}`);
    }
    return 'pending';
  }

  try {
    const { client, serviceSid } = getTwilioConfig();

    if (!client) {
      throw new Error('Twilio client failed to initialize.');
    }

    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: formattedTo, channel: 'sms' });

    return verification.status;
  } catch (error: unknown) {
    const err = error as Error;
    if (logger) {
      logger.error({ err, to: formattedTo }, 'Twilio Send Error');
    } else {
      console.error(`Twilio Send Error [${formattedTo}]: ${err.message}`);
    }
    throw error;
  }
};

/**
 * Checks a verification code against Twilio Verify records
 */
export const checkVerificationCode = async (
  to: string,
  otp: string,
  logger?: FastifyBaseLogger,
): Promise<VerificationCheckResult> => {
  const formattedTo = to.trim();
  const formattedOtp = otp.trim();

  if (IS_MOCK) {
    const isValid = formattedOtp === MOCK_OTP;
    if (logger) {
      logger.info({ to: formattedTo, success: isValid }, '[MOCK CHECK] Verification attempt');
    } else {
      console.log(`[MOCK CHECK] To: ${formattedTo} | Success: ${isValid}`);
    }
    return { status: isValid ? 'approved' : 'pending', valid: isValid };
  }

  try {
    const { client, serviceSid } = getTwilioConfig();

    if (!client) {
      throw new Error('Twilio client failed to initialize.');
    }

    const check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: formattedTo, code: formattedOtp });

    return {
      status: check.status,
      valid: check.status === 'approved',
    };
  } catch (error: unknown) {
    const err = error as Error;
    if (logger) {
      logger.error({ err, to: formattedTo }, 'Twilio Verify Error');
    } else {
      console.error(`Twilio Verify Error [${formattedTo}]: ${err.message}`);
    }
    throw error;
  }
};

/**
 * Unified service object for export
 */
export const twilioService = {
  sendVerificationCode,
  checkVerificationCode,
  sendSMS: async (to: string, _message: string, logger?: FastifyBaseLogger) =>
    sendVerificationCode(to, logger),
};
