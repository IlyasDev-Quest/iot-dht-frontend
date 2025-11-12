"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProviderClient";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(name.trim(), password);
    if (!res.ok) setError(res.error ?? "login failed");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Sign in</h2>
        <label className="block mb-2">
          <div className="text-sm mb-1">Name</div>
          <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="block mb-4">
          <div className="text-sm mb-1">Password</div>
          <input type="password" className="border p-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Sign in
        </button>
      </form>
    </div>
  );
}
