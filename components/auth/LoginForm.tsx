"use client";

import { Mail, Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SiGoogle, SiGithub } from '@icons-pack/react-simple-icons';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const { 
      register, 
      handleSubmit, 
      formState: { errors, isSubmitting } 
    } = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormValues) => {
        setAuthError(null); // Reset any previous errors
        await authClient.signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true
        }, {
            onSuccess: () => {
                router.push('/dashboard');
            },
            onError: (ctx) => {
                setAuthError(ctx.error.message);
            }
        });
    };

    return (<>
        <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="hover:border-theme-purple/50">
                <SiGoogle className="mr-2 h-4 w-4" />
                Google
            </Button>
            <Button variant="outline" className="hover:border-theme-purple/50">
                <SiGithub className="mr-2 h-4 w-4" />
                GitHub
            </Button>
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
        </div>
        {authError && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {authError}
            </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        {...register('email')}
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9"
                        disabled={isSubmitting}
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
                        {...register('password')}
                        id="password"
                        type="password"
                        className="pl-9"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>
            <div className="flex justify-end">
                <a href="#" className="text-sm text-theme-purple hover:underline">
                    Forgot password?
                </a>
            </div>
            <Button 
                type="submit" 
                variant="default"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                    </>
                ) : (
                    'Login'
                )}
            </Button>
        </form>
    </>);
}
