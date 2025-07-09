"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Task {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
}

export default function AgentTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const agentId = params.agentId as string;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token found.");

        const res = await fetch(
          `http://localhost:4000/api/v1/tasks/agents/${agentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();
        setTasks(data.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (agentId) fetchTasks();
  }, [agentId]);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <ListChecks className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Agent Task List</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-16">
          <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-medium mt-10">{error}</div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-6">
          <CardContent className="text-gray-500">No tasks assigned to this agent.</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task, index) => (
                  <TableRow key={task._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{task.firstName}</TableCell>
                    <TableCell>{task.phone}</TableCell>
                    <TableCell>{task.notes || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
