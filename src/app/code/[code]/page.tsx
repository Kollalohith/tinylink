"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LinkData {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default function StatsPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { code } = params;

  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`/api/links/${code}`);
        if (!res.ok) {
          throw new Error("Code not found");
        }
        const data = await res.json();
        setLink(data);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [code]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading stats …</div>;
  }

  if (errorMsg || !link) {
    return (
      <div className="p-6 text-center text-red-600">
        {errorMsg || "Code not found"}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stats for “{link.code}”</h1>

      <div className="p-4 border rounded-xl shadow bg-white space-y-2">
        <p>
          <span className="font-semibold">Short URL:</span>{" "}
          <a
            href={`/${link.code}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${window.location.origin}/${link.code}`}
          </a>
        </p>
        <p>
          <span className="font-semibold">Target URL:</span>{" "}
          <a
            href={link.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {link.targetUrl}
          </a>
        </p>
        <p>
          <span className="font-semibold">Total Clicks:</span> {link.totalClicks}
        </p>
        <p>
          <span className="font-semibold">Last Clicked:</span>{" "}
          {link.lastClickedAt
            ? new Date(link.lastClickedAt).toLocaleString()
            : "Never"}
        </p>
        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(link.createdAt).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => router.push("/")}
        className="inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
