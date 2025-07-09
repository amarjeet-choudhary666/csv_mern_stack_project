"use client";

import { useEffect, useState } from "react";
// @ts-expect-error: jwt-decode types may be missing in some environments
import jwtDecode from "jwt-decode";

interface Task {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
}

interface JwtPayload {
  _id: string;
  email: string;
  // Add more fields if needed
}

export default function AgentAssignedTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyTasks = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setError("Refresh token not found. Please login.");
        setLoading(false);
        return;
      }

      let agentId = "";
      try {
        const decoded = jwtDecode<JwtPayload>(refreshToken);
        agentId = decoded._id;
      } catch (err) {
        console.error("Invalid refresh token:", err);
        setError("Invalid refresh token. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const accessToken = localStorage.getItem("agentToken");
        const res = await fetch(
          `http://localhost:4000/api/v1/tasks/agents/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("API Error:", text);
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data.data || []);
      } catch (err: unknown) {
        console.error("Error:", err instanceof Error ? err.message : err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">🗂️ Your Assigned Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <ul className="list-disc ml-6 space-y-3">
          {tasks.map((task) => (
            <li key={task._id}>
              <p className="font-medium">{task.firstName}</p>
              <p className="text-sm text-gray-600">
                📞 {task.phone} {task.notes && <>– 📝 {task.notes}</>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
