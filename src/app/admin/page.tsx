"use client";

import useMessage from "@/hooks/useMessage";
import Link from "next/link";
import React, { useState } from "react";

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState("");
  const { message, showMessage } = useMessage();

  const startSystem = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/start",
      {
        method: "POST",
        headers: {
          "x-admin-token": adminToken,
        },
      }
    );
    const json = await res.json();
    showMessage(json.message || json.error || "Error");
  };

  const pauseSystem = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/pause",
      {
        method: "POST",
        headers: {
          "x-admin-token": adminToken,
        },
      }
    );
    const json = await res.json();
    showMessage(json.message || json.error || "Error");
  };

  return (
    <div className="p-6 font-sans">
      <Link href="/" className="text-blue-600 underline block mb-4 text-lg">
        Go home
      </Link>

      <h1 className="text-2xl font-bold mb-4">Admin panel</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Admin token:</label>
        <input
          type="password"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          className="border p-1 w-48"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={startSystem}
          className="bg-blue-600 text-white py-1 px-3 rounded mr-2"
        >
          Start system
        </button>
        <button
          onClick={pauseSystem}
          className="bg-red-600 text-white py-1 px-3 rounded"
        >
          Pause system
        </button>
      </div>

      {message && <p className="text-blue-700">{message}</p>}
    </div>
  );
}
