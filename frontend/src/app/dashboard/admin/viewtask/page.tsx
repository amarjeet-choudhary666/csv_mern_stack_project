"use client";

import { useEffect, useState } from "react";

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

interface Task {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
}

export default function ViewAssignedTasksPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasksMap, setTasksMap] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentsAndTasks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      // Fetch all agents
      const agentsRes = await fetch("http://localhost:4000/api/v1/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!agentsRes.ok) {
        const message = await agentsRes.text();
        throw new Error(`Agents fetch failed: ${message}`);
      }

      const agentsData = await agentsRes.json();
      const fetchedAgents: Agent[] = agentsData.data || [];
      setAgents(fetchedAgents);

      const tasksResults: Record<string, Task[]> = {};

      await Promise.all(
        fetchedAgents.map(async (agent) => {
          const taskRes = await fetch(
            `http://localhost:4000/api/v1/tasks/agents/${agent._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (taskRes.ok) {
            const taskData = await taskRes.json();
            tasksResults[agent._id] = taskData.data || [];
          } else {
            tasksResults[agent._id] = [];
          }
        })
      );

      setTasksMap(tasksResults);
      setError(null); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetch error:", err.message);
      } else {
        console.error("Fetch error:", err);
      }
      setError("Failed to load agents or tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsAndTasks(); 

    const intervalId = setInterval(() => {
      fetchAgentsAndTasks();
    }, 15000); 

    return () => clearInterval(intervalId); 
    }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">📋 Agent Task Overview</h1>

      {agents.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        agents.map((agent) => (
          <div
            key={agent._id}
            className="mb-6 border rounded-lg p-4 bg-white shadow"
          >
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              📧 {agent.email} | 📞 {agent.mobile}
            </p>

            {tasksMap[agent._id]?.length > 0 ? (
              <ul className="list-disc ml-6 space-y-2">
                {tasksMap[agent._id].map((task) => (
                  <li key={task._id}>
                    <p className="font-medium">{task.firstName}</p>
                    <p className="text-sm text-gray-500">
                      📞 {task.phone}
                      {task.notes && <> – 📝 {task.notes}</>}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No tasks assigned.
              </p>
            )}
          </div>
        ))
      )}
    </main>
  );
}
