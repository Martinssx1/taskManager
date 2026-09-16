import { useState } from "react";
import { Mail, Lock, AlertTriangle, CheckCircleIcon } from "lucide-react";
import { AuthShell, TextField } from "../Additional.jsx";

import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/useContext.js";

export default function LoginPage() {
  const {
    resendVerificationEmail,
    setAuthError,
    authError,
    verificationEmailSucess,
    isVerifyLoading,
    setToken,
  } = useTaskContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [
    errors, //setErrors
  ] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  async function handleOnSignIn(e) {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Error data:", data);
        setAuthError(data.message || "An error occurred while logging in.");
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newToken = data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      navigate("/");
    } catch (error) {
      console.error("error", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <AuthShell>
      <h1 className="mb-1 font-serif text-xl   text-stone-900 dark:text-stone-100">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        Sign in to see what's on your plate today.
      </p>

      {authError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-400">
          <AlertTriangle size={15} /> {authError}
        </div>
      )}

      <form
        onSubmit={handleOnSignIn}
        className=" flex flex-col gap-4"
        noValidate
      >
        <TextField
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-teal-800 cursor-pointer py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950 dark:bg-teal-700 dark:hover:bg-teal-600 dark:active:bg-teal-800"
        >
          {isLoading ? (
            <div className="flex justify-center ">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400" />
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center text-center text-sm text-stone-500 dark:text-stone-400">
        <p>
          New here?
          <button
            onClick={() => navigate("/register")}
            className="ml-2 cursor-pointer font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Create an account
          </button>
        </p>

        {authError.includes("verify your email") && (
          <div className="mt-3 flex flex-col items-center text-center">
            {isVerifyLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400" />
                <span>Resending verification email...</span>
              </div>
            ) : verificationEmailSucess ? (
              <div className="flex items-center justify-center gap-2 text-green-500">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Verification email resent!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => resendVerificationEmail(email)}
                className="cursor-pointer text-sm text-teal-700 hover:underline dark:text-teal-400"
              >
                Resend email verification link
              </button>
            )}
          </div>
        )}
      </div>
    </AuthShell>
  );
}
