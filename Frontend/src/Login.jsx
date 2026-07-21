import { useState } from "react";
import { Mail, Lock, AlertTriangle } from "lucide-react";
import { AuthShell, TextField } from "./Additional.jsx";
import { useNavigate } from "react-router-dom";
//import { useTaskContext } from "./useContext.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [
    errors, //setErrors
  ] = useState({});
  const [
    authError, // setAuthError
  ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //const { user, setUser } = useTaskContext();

  /*function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!email) nextErrors.email = "Enter your email.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // AUTH ACTIONS: replace with a real login request
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!match) {
      setAuthError("That email and password don't match an account.");
      return;
    }
    setAuthError("");
    onLogin(match);
  }
*/

  async function handleOnSignIn(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Sign-in response:", data);
      const token = data.token;
      localStorage.setItem("token", token);
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
      <h1 className="mb-1 font-serif text-xl   text-stone-900">Welcome back</h1>
      <p className="mb-6 text-sm text-stone-500">
        Sign in to see what's on your plate today.
      </p>

      {authError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
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
          className="w-full rounded-lg bg-teal-800 cursor-pointer py-2.5 text-sm font-medium text-white transition hover:bg-teal-900 active:bg-teal-950"
        >
          {isLoading ? (
            <div className="flex justify-center ">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        New here?
        <button
          onClick={() => navigate("/register")}
          className="font-medium ml-2 text-teal-700 hover:underline cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </AuthShell>
  );
}
