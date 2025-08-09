"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import forGuest from "@/components/auth/forGuest";
import { useTranslations } from "next-intl";

function SignUpPage() {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || "Registration failed");
        return;
      }

      setSuccessMsg(t("submit"));
      setErrorMsg("");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setErrorMsg("Something went wrong");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t("register")}</h2>

        {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder={t("firstName")}
            className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder={t("lastName")}
            className="w-full rounded-md bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

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
            {t("submit")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t("alreadyHaveAccount")}{" "}
          <a href="/login" className="text-emerald-600 font-medium hover:underline">
            {t("login")}
          </a>
        </p>
      </div>
    </main>
  );
}

export default forGuest(SignUpPage);
