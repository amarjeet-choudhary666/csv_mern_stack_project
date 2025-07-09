"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentRegisterPage() {
  type AgentFormData = {
    name: string;
    email: string;
    mobile: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AgentFormData>();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: AgentFormData) => {
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/v1/agents/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("Registration successful! Redirecting to login...");
        reset();
        setTimeout(() => router.push("/login/agent"), 1500);
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl bg-white/80 backdrop-blur-md animate-fade-in transition-all duration-500">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-extrabold text-slate-800">
            🧑‍💼 Agent Registration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Register yourself to receive tasks from admin
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Agent"
                {...register("name", { required: "Full name is required" })}
                className={cn(errors.name && "border-red-500")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="agent@example.com"
                type="email"
                {...register("email", { required: "Email is required" })}
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message as string}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                placeholder="+91 9876543210"
                type="tel"
                {...register("mobile", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^(\+91)?[6-9]\d{9}$/,
                    message: "Please enter a valid Indian mobile number"
                  }
                })}
                className={cn(errors.mobile && "border-red-500")}
                onChange={e => {
                  setError(null);
                  setMessage(null);
                  register("mobile").onChange(e);
                }}
              />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile.message as string}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className={cn(errors.password && "border-red-500")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message as string}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-semibold tracking-wide hover:scale-[1.02] transition-transform"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register as Agent"}
            </Button>
          </form>

          {message && <p className="text-green-600 text-center mt-4">{message}</p>}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <div className="text-center text-sm text-muted-foreground mt-6">
            Already registered?
            <a href="/login/agent" className="text-blue-600 hover:underline">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
