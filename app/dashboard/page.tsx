import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { CreditDisplay } from "@/components/dashboard/CreditDisplay";
import { GeneratedImages } from "@/components/dashboard/GeneratedImages";
import { Sparkles } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: headers()
    });
    
    if (!session) {
        redirect("/auth?tab=login");
    }

    return (
        <main className="min-h-screen bg-black/50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Welcome Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Welcome back, {session.user.name || 'there'}!
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Manage your brand assets and credits
                        </p>
                    </div>
                </div>

                {/* Credits Card */}
                <div className="mb-8">
                    <CreditDisplay userId={session.user.id} />
                </div>

                {/* Generated Images */}
                <div className="relative">
                    <div className="absolute inset-x-0 -top-10 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    <GeneratedImages userId={session.user.id} />
                </div>
            </div>
        </main>
    );
}