import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";
import { AuthShell } from "../Additional.jsx";

export default function EmailVerificationPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const { token } = useParams();
  useEffect(() => {
    async function checkEmailVerification() {
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-email/${token}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw Error("something went wrong response error ");
        }
        ///maybe edit needed
        setStatus("success");
        setMessage("Email verified successfully!");

        const data = await res.json();

        console.log("email res", data);
      } catch (err) {
        console.log(err);
        setStatus("error");
        setMessage("Failed to verify email.");
        return;
      }
    }
    checkEmailVerification();
  }, [token]);

  return (
    <AuthShell>
      <div className="flex min-h-87.5 flex-col items-center justify-center text-center">
        {status === "loading" && (
          <>
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-teal-700 dark:border-stone-700 dark:border-t-teal-400" />
            </div>

            <h1 className="mb-2 font-serif text-2xl text-stone-900 dark:text-stone-100">
              Verifying your email
            </h1>

            <p className="max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950">
              <CircleCheck
                size={58}
                strokeWidth={1.8}
                className="text-teal-700 dark:text-teal-400"
              />
            </div>

            <h1 className="mb-2 font-serif text-2xl text-stone-900 dark:text-stone-100">
              Email verified!
            </h1>

            <p className="max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
              {message || "Your email has been verified successfully."}
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-7 w-full cursor-pointer rounded-lg bg-teal-800 py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950 dark:bg-teal-700 dark:hover:bg-teal-600 dark:active:bg-teal-800"
            >
              Continue to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950">
              <CircleX
                size={58}
                strokeWidth={1.8}
                className="text-rose-600 dark:text-rose-400"
              />
            </div>

            <h1 className="mb-2 font-serif text-2xl text-stone-900 dark:text-stone-100">
              Verification failed
            </h1>

            <p className="max-w-sm text-sm leading-6 text-stone-500 dark:text-stone-400">
              {message || "This verification link is invalid or has expired."}
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-7 w-full cursor-pointer rounded-lg bg-teal-800 py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950 dark:bg-teal-700 dark:hover:bg-teal-600 dark:active:bg-teal-800"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </AuthShell>
  );
}
