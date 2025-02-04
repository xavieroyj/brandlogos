"use client";

import { Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Define the registration schema with Zod
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password cannot exceed 32 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setServerError(null);

        try {
            const { data: authData, error: authError } = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            });

            if (authError) {
                throw new Error(authError.message);
            }

            // Handle successful registration
            console.log("Registered user:", authData?.user);
            router.push("/dashboard"); // Redirect to email verification page
            
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to get started
                </p>
            </div>
            
            {serverError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                    {serverError}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            placeholder="John Doe"
                            className="pl-9"
                            {...register("name")}
                            aria-invalid={errors.name ? "true" : "false"}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9"
                            {...register("email")}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type="password"
                            className="pl-9"
                            {...register("password")}
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            className="pl-9"
                            {...register("confirmPassword")}
                            aria-invalid={errors.confirmPassword ? "true" : "false"}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Sign up"}
                </Button>
            </div>
        </form>
    );
}