"use client";

import { useEffect, useState } from "react";
import { UserRoundSearch, Loader2 } from "lucide-react"; // Optional icons if you're using lucide

interface Agent {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/agents");

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const json = await res.json();
        console.log("API response:", json);

        if (Array.isArray(json.data)) {
          setAgents(json.data);
        } else if (Array.isArray(json.agents)) {
          setAgents(json.agents);
        } else if (Array.isArray(json)) {
          setAgents(json);
        } else {
          throw new Error("Unexpected API format");
        }
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex items-center gap-3 mb-8">
        <UserRoundSearch className="text-blue-600" size={28} />
        <h1 className="text-3xl font-bold text-gray-800">Agent List</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center text-gray-600 mt-20">
          <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-500" />
          Loading agents...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow ring-1 ring-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-3">#</th>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Mobile</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
              {agents.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center px-6 py-5 italic text-gray-500"
                  >
                    No agents found.
                  </td>
                </tr>
              ) : (
                agents.map((agent, idx) => (
                  <tr
                    key={agent._id || idx}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">{agent.name}</td>
                    <td className="px-6 py-4">{agent.email}</td>
                    <td className="px-6 py-4">{agent.mobile}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
