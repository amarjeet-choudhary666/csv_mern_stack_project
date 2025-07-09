'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const fetchAgentsAndTasks = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found.');

        const agentsRes = await fetch('http://localhost:4000/api/v1/agents/', {
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Fetch error:', err.message);
        } else {
          console.error('Fetch error:', err);
        }
        setError('Failed to load agents or tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentsAndTasks();
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
    <main className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">📋 Agent Task Overview</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-md rounded-lg">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Mobile</th>
              <th className="py-3 px-4">Tasks</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr key={agent._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{agent.name}</td>
                <td className="py-3 px-4">{agent.email}</td>
                <td className="py-3 px-4">{agent.mobile}</td>
                <td className="py-3 px-4">
                  {tasksMap[agent._id]?.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 text-sm">
                      {tasksMap[agent._id].map((task) => (
                        <li key={task._id}>
                          <span className="font-medium">{task.firstName}</span>
                          <span className="text-gray-500">
                            {" "}
                            (📞 {task.phone}
                            {task.notes && `, 📝 ${task.notes}`})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-400 text-sm">
                      No tasks
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => alert(`Assign task to ${agent.name}`)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
