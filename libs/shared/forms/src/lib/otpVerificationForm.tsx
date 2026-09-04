// client/src/components/Layouts/Forms/OtpVerificationForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useOtpVerification } from "@domo/hooks";

interface OtpVerificationFormProps {
  phone: string;
  onSuccess?: () => void;
  otpLength?: number;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  phone,
  onSuccess,
  otpLength = 6,
}) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  
  const { 
    handleVerify, 
    handleResend, 
    resetStatus,
    isLoading, 
    error, 
    isSuccess, 
    timer, 
    canResend 
  } = useOtpVerification(phone);

  // Improved Auto-submit logic: only trigger if there isn't an active error
  useEffect(() => {
    if (otp.length === otpLength && !isLoading && !isSuccess && !error) {
      handleVerify(otp);
    }
  }, [otp, otpLength, handleVerify, isLoading, isSuccess, error]);

  // Handle successful verification & redirect
  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
      const timeout = setTimeout(() => navigate({ to: "/" }), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess, navigate, onSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (error) resetStatus(); // Clear error as soon as user types again
    if (val.length <= otpLength) setOtp(val);
  };

  if (isSuccess) {
    return React.createElement(
      "div",
      { className: "container w-max h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300" },
      React.createElement(
        "div",
        { className: "w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4" },
        React.createElement(
          "svg",
          { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
          React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }),
        ),
      ),
      React.createElement("h3", { className: "text-xl font-bold text-gray-900 dark:text-white" }, "Phone Verified!"),
      React.createElement("p", { className: "text-gray-500 text-sm mt-1" }, "Directing you to your dashboard..."),
    );
  }

  return React.createElement(
    "div",
    { className: "w-full h-screen" },
    React.createElement(
      "form",
      {
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (otp.length === otpLength) handleVerify(otp);
        },
        className: "space-y-6",
      },
      React.createElement(
        "div",
        { className: "relative" },
        React.createElement("input", {
          type: "text",
          inputMode: "numeric",
          autoComplete: "one-time-code",
          maxLength: otpLength,
          value: otp,
          onChange: handleChange,
          placeholder: "······",
          className: `text-center tracking-[0.5em] text-3xl font-bold p-4 bg-gray-50 dark:bg-zinc-900 border-2 rounded-xl focus:outline-none transition-all
            ${error ? "border-red-500 ring-4 ring-red-100 dark:ring-red-900/10" : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"}
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            text-gray-900 dark:text-white`,
          disabled: isLoading,
          autoFocus: true,
        }),
      ),
      error &&
        React.createElement(
          "div",
          { className: "p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800 text-center animate-shake" },
          error,
        ),
      React.createElement(
        "button",
        {
          type: "submit",
          disabled: isLoading || otp.length !== otpLength,
          className: "w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-zinc-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
        },
        isLoading ? "Verifying..." : "Verify & Continue",
      ),
    ),
    React.createElement(
      "div",
      { className: "mt-6 text-center" },
      React.createElement(
        "button",
        {
          type: "button",
          onClick: handleResend,
          disabled: !canResend || isLoading,
          className: "text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors",
        },
        canResend ? "Resend SMS" : `Resend in ${timer}s`,
      ),
    ),
  );
};

export default OtpVerificationForm;