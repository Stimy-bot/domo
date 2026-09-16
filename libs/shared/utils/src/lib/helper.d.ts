import type { ClassValue } from 'clsx';
export declare const formatNameToTitle: (snakeCaseStr: string) => string;
export declare const sleep: (ms: number) => Promise<void>;
export declare const cn: (...inputs: ClassValue[]) => string;
export declare const required: (msg?: string) => (value: string) => string | undefined;
export declare const minLength: (min: number, msg?: string) => (value: string) => string | undefined;
export declare const isEmail: (msg?: string) => (value: string) => string | undefined;
export declare const passwordStrength: (msg?: string) => (value: string) => string | undefined;
export declare const composeValidators: (...validators: ((v: string) => string | undefined)[]) => (value: string) => string | undefined;
export declare const toFieldValidators: (...validators: ((v: string) => string | undefined)[]) => {
    onChange: (value: string) => string | undefined;
};
export declare function isValidUrl(value: string): boolean;
export type ReturnOf<F> = F extends (...args: unknown[]) => infer R ? R : never;
//# sourceMappingURL=helper.d.ts.map