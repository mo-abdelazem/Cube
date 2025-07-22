"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (res?.error) {
    setErrorMsg("Invalid email or password");
  } else {
    router.push("/dashboard");
  }
};

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sign in</h2>

        {errorMsg && (
          <p className="text-red-600 text-sm mb-2 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Username or email"
            className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-emerald-500 w-4 h-4"
                defaultChecked
              />
              Remember
            </label>
            <a href="#" className="hover:text-emerald-600">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-md"
          >
            Login
          </button>
        </form>

        <div className="text-center text-gray-400 my-4 relative text-sm">
          <span className="relative z-10 bg-white px-2">or sign up with</span>
          <div className="absolute top-1/2 w-full h-px bg-gray-300 left-0 z-0"></div>
        </div>

        {/* <div className="flex flex-col gap-3 mb-4">
          <a
            href="#"
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2 text-sm font-medium hover:border-emerald-500 hover:shadow"
          >
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/03e11607-8177-4538-9449-e82b222afb94.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in using Google
          </a>

          <a
            href="#"
            className="flex items-center justify-center gap-3 border border-blue-700 text-blue-700 rounded-md py-2 text-sm font-medium hover:bg-blue-700 hover:text-white"
          >
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ca78057f-b02a-4da7-b139-a0a432c6e692.png"
              alt="Facebook logo"
              className="w-5 h-5"
            />
            Sign in using Facebook
          </a>
        </div> */}

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-emerald-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
