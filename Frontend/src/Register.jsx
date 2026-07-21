import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { AuthShell, TextField } from "./Additional.jsx";
import { useNavigate } from "react-router-dom";
export default function RegisterPage({
  // onRegister,
  goLogin,
  // users
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [
    errors,
    // setErrors
  ] = useState({});
  const navigate = useNavigate();
  async function handleSignUpSuccess(e) {
    e.preventDefault();
    if (!fullName || !email || !password) {
      console.log("3. Missing fields");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3000/auth/signup", {
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
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Sign-up response:", data);
      if (data.result.affectedRows > 0) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  /*

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!name) nextErrors.name = "Enter your name.";
    if (!email) nextErrors.email = "Enter your email.";
    else if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      nextErrors.email = "An account with this email already exists.";
    }
    if (!password) nextErrors.password = "Choose a password.";
    else if (password.length < 6)
      nextErrors.password = "Use at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // AUTH ACTIONS: replace with a real registration request
    onRegister({ name, email, password });
  }*/

  return (
    <AuthShell>
      <h1 className="mb-1 font-serif text-xl text-stone-900">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        Takes less time than reading your inbox.
      </p>

      <form onSubmit={handleSignUpSuccess} className="space-y-4" noValidate>
        <TextField
          label="Full name"
          icon={User}
          placeholder="Ada Lovelace"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.name}
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
          className="w-full rounded-lg bg-teal-800 py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950"
        >
          {isLoading ? (
            <div className="flex justify-center ">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
            </div>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-stone-500">
        Already have an account?
        <button
          onClick={goLogin}
          className="font-medium text-teal-700 hover:underline"
        >
          Sign in
        </button>
      </p>
    </AuthShell>
  );
}
