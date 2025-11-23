"use client";

import { useEffect, useState } from "react";

interface Link {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: string | null;
}

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadStats = async () => {
    try {
      const { code } = await params;

      const res = await fetch(`/api/links/${code}`);

      if (!res.ok) {
        setErrorMsg("Short code not found.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLink(data);
      setLoading(false);
    } catch (err) {
      console.error("Stats error:", err);
      setErrorMsg("Failed to load stats.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading stats...</div>
    );
  }

  if (errorMsg || !link) {
    return (
      <div className="p-6 text-center text-red-600">
        {errorMsg || "Short link not found"}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stats for "{link.code}"</h1>

      <div className="p-4 border rounded-xl shadow bg-white space-y-2">
        <p>
          <span className="font-semibold">Short Code:</span> {link.code}
        </p>

        <p>
          <span className="font-semibold">Target URL:</span>{" "}
          <a
            href={link.targetUrl}
            target="_blank"
            className="text-blue-600 underline break-all"
          >
            {link.targetUrl}
          </a>
        </p>

        <p>
          <span className="font-semibold">Total Clicks:</span>{" "}
          {link.totalClicks}
        </p>

        <p>
          <span className="font-semibold">Last Clicked:</span>{" "}
          {link.lastClickedAt
            ? new Date(link.lastClickedAt).toLocaleString()
            : "Never"}
        </p>
      </div>

      <a
        href="/"
        className="inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Back to Dashboard
      </a>
    </div>
  );
}
