"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type RegisterFormData = {
    fullName: string;
    email: string;
    password: string;
};

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>();

    const router = useRouter(); 

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await fetch("http://localhost:4000/api/v1/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            alert("Registration successful!");
            router.push("/login/admin"); 
        } catch (error: unknown) {
            let message = "An unknown error occurred";
            if (error instanceof Error) {
                message = error.message;
            }
            console.error("Registration error:", message);
            alert("Error: " + message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-violet-100 to-pink-100 p-4">
            <Card className="w-full max-w-md p-2 md:p-6 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-slate-800">
                        📝 Admin Registration
                    </CardTitle>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                        Create an admin account to manage agents and tasks
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-1">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...register("fullName", { required: "Full name is required" })}
                                className={cn(errors.fullName && "border-red-500")}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-500 animate-pulse">{errors.fullName.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="admin@example.com"
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className={cn(errors.email && "border-red-500")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 animate-pulse">{errors.email.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                className={cn(errors.password && "border-red-500")}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 animate-pulse">{errors.password.message as string}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full hover:scale-[1.01] transition-transform"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?
                        <a href="/login/admin" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
