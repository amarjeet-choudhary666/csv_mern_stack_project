"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 px-6 py-16">
      <div className="w-full max-w-4xl text-center flex flex-col items-center gap-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
          Welcome to the Task Management System
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          A simple MERN-based platform for Admins to manage agents, upload task lists, and distribute responsibilities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
          <div className="rounded-3xl p-6 border shadow-lg bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Admin Access</h2>
            <div className="flex flex-col gap-4">
              <Link href="/register/admin">
                <Button className="w-full">Register as Admin</Button>
              </Link>
              <Link href="/login/admin">
                <Button variant="outline" className="w-full">
                  Login as Admin
                </Button>
              </Link>
            </div>
          </div>

          {/* Agent Block */}
          <div className="rounded-3xl p-6 border shadow-lg bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Agent Access</h2>
            <div className="flex flex-col gap-4">
              <Link href="/register/agent">
                <Button className="w-full">Register as Agent</Button>
              </Link>
              <Link href="/login/agent">
                <Button variant="outline" className="w-full">
                  Login as Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <footer className="text-sm text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} TaskApp • Built with ❤️ and Next.js
        </footer>
      </div>
    </section>
  );
}
