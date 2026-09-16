export declare function loadEnv(): {
    MONGO_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    COOKIE_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
    SERVER_PORT: string | undefined;
    HOST: string | undefined;
    PORT: string | undefined;
    APP_ORIGIN: string;
    EMAIL_SENDER: string | undefined;
    RESEND_API_KEY: string | undefined;
    TWILIO_ACCOUNT_SID: string | undefined;
    TWILIO_AUTH_TOKEN: string | undefined;
    TWILIO_PHONE_NUMBER: string | undefined;
    TWILIO_VERIFY_SERVICE_SID: string | undefined;
    MY_PERSONAL_NUMBER: string | undefined;
    EMAIL_USER: string | undefined;
    EMAIL_PASS: string | undefined;
    SMS_MOCK: boolean;
    isDev: boolean;
    isProd: boolean;
    isTest: boolean;
};
//# sourceMappingURL=env.d.ts.map