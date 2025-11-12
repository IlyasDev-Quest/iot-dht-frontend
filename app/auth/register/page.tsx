"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProviderClient";

export default function RegisterPage() {
  const { register, registering, registeringError } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await register(name.trim(), password, role);
    if (!res.ok) setError(res.error ?? "failed to register");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Create an account</h2>
        <label className="block mb-2">
          <div className="text-sm mb-1">Name</div>
          <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="block mb-2">
          <div className="text-sm mb-1">Password</div>
          <input type="password" className="border p-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <label className="block mb-4">
          <div className="text-sm mb-1">Role</div>
          <select className="border p-2 w-full" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {(error || registeringError) && <div className="text-red-600 mb-2">{error ?? registeringError}</div>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={registering}>
          {registering ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
