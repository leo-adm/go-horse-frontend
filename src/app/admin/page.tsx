"use client";

import useMessage from "@/hooks/useMessage";
import { useAuth } from "@clerk/nextjs";
import React from "react";

export default function AdminPage() {
  const { message, showMessage } = useMessage();
  const { getToken } = useAuth();

  const startSystem = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/start",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (await getToken()),
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
          Authorization: "Bearer " + (await getToken()),
        },
      }
    );
    const json = await res.json();
    showMessage(json.message || json.error || "Error");
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-lg font-bold mb-4">Admin panel</h1>

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
