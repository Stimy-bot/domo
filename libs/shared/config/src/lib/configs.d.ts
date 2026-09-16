import type { MongoClientOptions } from 'mongodb';
export declare const DEVELOPMENT: boolean;
export declare const TEST: boolean;
export declare const MONGO_USER: string;
export declare const MONGO_PASSWORD: string;
export declare const MONGO_DATABASE: string;
export declare const MONGO_OPTIONS: MongoClientOptions;
export declare const MONGO_CONNECTION: string;
export declare const mongo: {
    MONGO_USER: string;
    MONGO_PASSWORD: string;
    MONGO_URL: string;
    MONGO_DATABASE: string;
    MONGO_OPTIONS: MongoClientOptions;
    MONGO_CONNECTION: string;
};
export declare const SERVER_HOSTNAME: string;
export declare const SERVER_PORT: number;
export declare const server: {
    SERVER_HOSTNAME: string;
    SERVER_PORT: number;
};
export declare const configs: {
    RESEND_API_KEY: string | undefined;
    GMAIL: string | undefined;
    USER: string | undefined;
    PASS: string | undefined;
    EMAIL: string;
    HOST: string;
    GMAILPORT: string | undefined;
    GMAILHOST: string | undefined;
    MAILPORT: number;
    YOURNAME: string;
    YOURSITE: string;
    GMAILPASS: string | undefined;
    JWT_ACCESS_SECRET: string | undefined;
    JWT_REFRESH_SECRET: string | undefined;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    MY_PERSONAL_NUMBER: string;
    TWILIO_ACCOUNT_SID: string | undefined;
    TWILIO_AUTH_TOKEN: string | undefined;
    TWILIO_PHONE_NUMBER: string | undefined;
    TWILIO_VERIFY_SERVICE_SID: string | undefined;
    SMS_MOCK: string | boolean;
    mail: {
        host: string;
        port: number;
        user: string;
        pass: string;
        fromName: string;
    };
};
export declare const carrierGateway: Record<string, string>;
//# sourceMappingURL=configs.d.ts.map