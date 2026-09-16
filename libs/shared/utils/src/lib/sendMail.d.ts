type Params = {
    to: string;
    subject: string;
    text: string;
    html: string;
};
export declare const sendMail: ({ to, subject, text, html }: Params) => Promise<import("resend").CreateEmailResponse>;
export {};
//# sourceMappingURL=sendMail.d.ts.map