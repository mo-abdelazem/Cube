"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import forGuest from "@/components/auth/forGuest";
import { useTranslations } from "next-intl";

function LoginPage() {
  const t = useTranslations("Auth");
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
      setErrorMsg(t("invalidCredentials"));
    } else {
      router.push("/");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t("login")}</h2>

        {errorMsg && (
          <p className="text-red-600 text-sm mb-2 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder={t("email")}
            className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t("password")}
            className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-md"
          >
            {t("login")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t("dontHaveAccount")}{" "}
          <Link
            href="/signup"
            className="text-emerald-600 font-medium hover:underline"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </main>
  );
}

export default forGuest(LoginPage);
