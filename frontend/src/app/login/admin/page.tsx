"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  type FormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("http://localhost:4000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem("admin", JSON.stringify(result.user));
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/admin");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-200 px-4 py-12">
      <Card className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl bg-white/90 backdrop-blur-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-slate-800">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage tasks and agents</p>
        </CardHeader>

        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email", { required: "Email is required" })}
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message as string}</p>
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

              {apiError && <p className="text-sm text-red-600">{apiError}</p>}

              <Button
                type="submit"
                className="w-full flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
              <CheckCircle2 className="text-green-500 w-12 h-12" />
              <p className="text-lg font-semibold text-green-600">Login Successful!</p>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?
            <a href="/register/admin" className="text-blue-600 hover:underline ml-1">
              Register here
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}