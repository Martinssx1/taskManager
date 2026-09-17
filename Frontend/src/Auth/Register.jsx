import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { AuthShell, TextField } from "../Additional.jsx";
import { useNavigate } from "react-router-dom";
export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  async function handleSignUpSuccess(e) {
    e.preventDefault();
    if (!fullName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Please enter your full name",
      }));
      return;
    }

    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter your email",
      }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address",
      }));
      return;
    }

    if (!password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Please enter your password",
      }));
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      if (data.result.affectedRows > 0) {
        navigate("/signup-success");
      }
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setIsLoading(false);
    }
  }
  function goLogin() {
    navigate("/login");
  }

  return (
    <AuthShell>
      <h1 className="mb-1 font-serif text-xl text-stone-900 dark:text-stone-100">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        Takes less time than reading your inbox.
      </p>

      <form onSubmit={handleSignUpSuccess} className="space-y-4" noValidate>
        <TextField
          label="Full name"
          icon={User}
          placeholder="Ada Lovelace"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
        />
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-teal-800 py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950 dark:bg-teal-700 dark:hover:bg-teal-600 dark:active:bg-teal-800"
        >
          {isLoading ? (
            <div className="flex justify-center ">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400" />
            </div>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-stone-500 dark:text-stone-400">
        Already have an account?
        <button
          onClick={goLogin}
          className="font-medium text-teal-700 hover:underline dark:text-teal-400 cursor-pointer ml-2"
        >
          Sign in
        </button>
      </p>
    </AuthShell>
  );
}
