// libs/shared/forms/src/lib/resetPasswordForm.tsx
import { createElement, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { resetPassword } from "@domo/client";

const ResetPasswordForm = ({ code }: { code: string }) => {
  const [password, setPassword] = useState("");
  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ password, verificationCode }: { password: string; verificationCode: string }) =>
      resetPassword({ password, verificationCode }),
  });

  const submit = () => resetUserPassword({ password, verificationCode: code });
  const content = isSuccess
    ? createElement("div", { className: "space-y-4 text-center" },
        createElement("div", { className: "bg-green-100 text-green-700 px-4 py-2 rounded-md" }, "Password updated successfully!"),
        createElement(Link, { to: "/login", replace: true, className: "text-blue-500 hover:underline" }, "Sign in"))
    : createElement("form", { className: "space-y-4", onSubmit: (e: { preventDefault: () => void }) => { e.preventDefault(); submit(); } },
        createElement("input", { id: "password", type: "password", value: password, autoFocus: true, onChange: (e: { target: { value: string } }) => setPassword(e.target.value), className: "w-full px-3 py-2 rounded-md" }),
        createElement("button", { type: "submit", disabled: password.length < 6 || isPending }, isPending ? "Resetting..." : "Reset Password"));
  return createElement("div", { className: "space-y-6" },
    createElement("h1", { className: "text-3xl font-bold text-center" }, "Change your password"),
    createElement("div", { className: "bg-gray-800 text-white rounded-lg shadow-md p-6" }, isError && createElement("div", { className: "mb-4 text-red-400 text-sm" }, error?.message || "An error occurred"), content));
};

export default ResetPasswordForm;
