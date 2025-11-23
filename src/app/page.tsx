"use client";

import { useEffect, useState } from "react";

interface Link {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: string | null;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [longUrl, setLongUrl] = useState("");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Load links
  const loadLinks = async () => {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // Add link
  const addLink = async () => {
    if (!longUrl.trim()) {
      setErrorMsg("URL cannot be empty.");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ longUrl, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Something went wrong.");
      setSubmitting(false);
      return;
    }

    setLongUrl("");
    setCode("");
    setSubmitting(false);
    loadLinks();
  };

  // Delete link
  const deleteLink = async (code: string) => {
    await fetch(`/api/links/${code}`, { method: "DELETE" });
    loadLinks();
  };

  // Copy short URL
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Short link copied!");
  };

  const filtered = links.filter(
    (l) =>
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.targetUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">TinyLink Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Shorten URLs, view analytics, and manage links easily.
        </p>
      </header>

      {/* Create Link Card */}
      <div className="max-w-3xl bg-white shadow-md p-6 rounded-2xl mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create Short Link
        </h2>

        {errorMsg && (
          <p className="mb-3 p-3 rounded-lg bg-red-100 text-red-700">
            {errorMsg}
          </p>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Paste long URL..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Custom code (optional)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={addLink}
            disabled={submitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Creating..." : "Create Short Link"}
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="max-w-3xl mb-6">
        <input
          type="text"
          placeholder="Search by code or target URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Links Table */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Short URL</th>
              <th className="p-4 text-left">Target URL</th>
              <th className="p-4 text-left">Clicks</th>
              <th className="p-4 text-left">Last Clicked</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Loading links...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No links found.
                </td>
              </tr>
            ) : (
              filtered.map((link) => (
                <tr key={link.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-blue-600 underline">
                    <a href={`${base}/${link.code}`} target="_blank">
                      {base}/{link.code}
                    </a>
                  </td>

                  <td className="p-4 max-w-sm truncate text-gray-700">
                    <a href={link.targetUrl} target="_blank" className="underline">
                      {link.targetUrl}
                    </a>
                  </td>

                  <td className="p-4">{link.totalClicks}</td>

                  <td className="p-4">
                    {link.lastClickedAt
                      ? new Date(link.lastClickedAt).toLocaleString()
                      : "—"}
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => copyToClipboard(`${base}/${link.code}`)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => deleteLink(link.code)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
