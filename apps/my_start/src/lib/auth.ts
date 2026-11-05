// apps/my_start/src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer, jwt, phoneNumber, twoFactor } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import clientPromise from "./db";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret:
    process.env.JWT_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    "development_fallback_secret_32_chars_long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5173",

  // Session lifetime set to 30 days
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 Days
    updateAge: 60 * 60 * 24, // Extends session window daily on activity
  },

  // Explicitly declare additional user fields for TypeScript and MongoDB schema
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        returned: true,
      },
      lastName: {
        type: "string",
        required: false,
        returned: true,
      },
      phoneNumber: {
        type: "string",
        required: false,
        returned: true,
      },
      birthDate: {
        type: "string",
        required: false,
        returned: true,
      },
            image: {
        type: "string",
        required: false,
        returned: true,
      },
            gender: {
        type: "string",
        required: false,
        returned: true,
      },
            bio: {
        type: "string",
        required: false,
        returned: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === "production",
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      console.log(`[Email Verification] Link for ${user.email}: ${url}`);
    },
  },

  plugins: [
    // 1. JWT Plugin utilizing your JWT_REFRESH_SECRET
    jwt({
      jwt: {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          "development_refresh_secret_32_chars_long",
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          id: user.id,
          firstName: (user as { firstName?: string }).firstName,
          lastName: (user as { lastName?: string }).lastName,
          email: user.email,
          phoneNumber: (user as Record<string, unknown>).phoneNumber as
            string | undefined,
          birthDate: (user as { birthDate?: string }).birthDate,
        }),
      },
    }),

    // 2. Bearer token support
    bearer(),

    // 3. Phone Number plugin for SMS OTP
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        console.log(`[SMS OTP] Send code ${code} to phone ${phoneNumber}`);
      },
    }),

    // 4. Two-Factor Authentication plugin
    twoFactor({
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          console.log(`[2FA Code] Send code ${otp} to ${user.email}`);
        },
      },
    }),

    // 5. TanStack Start Cookies plugin MUST be placed LAST in the array
    tanstackStartCookies(),
  ],

  socialProviders: {
    google:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,

    github:
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }
        : undefined,

    linkedin:
      process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
        ? {
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          }
        : undefined,
  },
});
