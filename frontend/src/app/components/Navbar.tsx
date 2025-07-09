import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-6 p-4 shadow bg-white sticky top-0 z-50">
      <Link href="/dashboard/admin" className="font-semibold">Dashboard</Link>
      <Link href="/register/agent">Add Agent</Link>
      <Link href="/upload">Upload CSV</Link>
      <Link href="/dashboard/allAgents">All Agents</Link>
    </nav>
  );
}
