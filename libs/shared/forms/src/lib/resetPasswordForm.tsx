import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { resetPassword } from "@/api/auth";

const ResetPasswordForm = ({ code }: { code: string }) => {
  const [password, setPassword] = useState("");
  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Change your password</h1>

      <div className="bg-gray-800 text-white rounded-lg shadow-md p-6">
        {isError && (
          <div className="mb-4 text-red-400 text-sm">
            {error?.message || "An error occurred"}
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Password updated successfully!</span>
            </div>
            <Link
              to="/login"
              replace
              className="text-blue-500 hover:underline"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetUserPassword({ password, verificationCode: code });
            }}
          >
            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  resetUserPassword({ password, verificationCode: code })
                }
                autoFocus
                className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={password.length < 6 || isPending}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
