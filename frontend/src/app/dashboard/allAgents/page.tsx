    "use client";

    import { useEffect, useState } from "react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent } from "@/components/ui/card";
    import {
      Table,
      TableHeader,
      TableRow,
      TableHead,
      TableBody,
      TableCell,
    } from "@/components/ui/table";
    import { UserRoundSearch, Loader2 } from "lucide-react";

    interface Agent {
      _id: string;
      name: string;
      email: string;
      mobile: string;
    }

    export default function ViewAgentsPage() {
      const [agents, setAgents] = useState<Agent[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const router = useRouter();

      const fetchAgents = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) throw new Error("No access token found. Please log in.");

          const response = await fetch("http://localhost:4000/api/v1/agents", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to fetch agents: ${text}`);
          }

          const data = await response.json();
          setAgents(data.data || []);
          setError(null);
        } catch (err: unknown) {
          console.error("Agent fetch error:", err);
          setError("Failed to load agents. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchAgents();
        const intervalId = setInterval(fetchAgents, 15000);
        return () => clearInterval(intervalId);
      }, []);

      return (
        <main className="max-w-6xl mx-auto py-10 px-4 font-poppins ">
          <div className="flex items-center gap-3 mb-6">
            <UserRoundSearch className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold text-gray-800 font-poppins">All Agents List</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-20 text-gray-600">
              <Loader2 className="animate-spin w-5 h-5 mr-2 text-blue-500" />
              Loading agents...
            </div>
          ) : error ? (
            <div className="text-center mt-10 text-red-500 font-semibold">{error}</div>
          ) : agents.length === 0 ? (
            <Card className="text-center py-10">
              <CardContent className="text-gray-500">No agents found.</CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent, index) => (
                      <TableRow key={agent._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.email}</TableCell>
                        <TableCell>{agent.mobile}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => router.push(`/agents/tasks/${agent._id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            variant="default"
                            size="sm"
                          >
                            View Tasks
                          </Button>
                        </TableCell>
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
