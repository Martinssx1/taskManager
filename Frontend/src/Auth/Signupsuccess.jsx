import { CircleCheck, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "../Additional.jsx";

export default function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950">
          <CircleCheck
            size={48}
            strokeWidth={1.8}
            className="text-teal-700 dark:text-teal-400"
          />
        </div>

        {/* Heading */}
        <h1 className="mb-2 font-serif text-2xl text-stone-900 dark:text-stone-100">
          Account created!
        </h1>

        <p className="max-w-sm text-sm leading-5 text-stone-500 dark:text-stone-400">
          Your account has been created successfully.
        </p>

        {/* Verification Message */}
        <div className="mt-5 w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-left dark:border-stone-700 dark:bg-stone-800/50">
          <div className="flex gap-3">
            <Mail
              size={19}
              className="mt-0.5 shrink-0 text-teal-700 dark:text-teal-400"
            />

            <div>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                Verify your email
              </p>

              <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-stone-400">
                We've sent a verification link to your email. Please verify your
                account before signing in.
              </p>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-teal-800 py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950 dark:bg-teal-700 dark:hover:bg-teal-600 dark:active:bg-teal-800"
        >
          Go to Login
          <ArrowRight size={17} />
        </button>

        {/* Resend */}
        <p className="mt-4 text-xs text-stone-500 dark:text-stone-400">
          Didn't receive the email?
          <button
            type="button"
            className="ml-1.5 cursor-pointer font-medium text-teal-700 hover:underline dark:text-teal-400"
          >
            Resend verification
          </button>
        </p>

        <p className="mt-3 text-[11px] text-stone-400 dark:text-stone-500">
          Verification links expire after 5 minutes.
        </p>
      </div>
    </AuthShell>
  );
}
