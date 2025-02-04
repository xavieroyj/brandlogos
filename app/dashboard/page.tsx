import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { CreditDisplay } from "@/components/dashboard/CreditDisplay";
import { GeneratedImages } from "@/components/dashboard/GeneratedImages";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: headers()
    });
    
    if (!session) {
        redirect("/auth?tab=login");
    }

    return (
        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col gap-8">
                {/* Welcome Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back, {session.user.name || 'there'}!
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Manage your brand assets and credits
                        </p>
                    </div>
                </div>

                {/* Credits Card */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <CreditDisplay userId={session.user.id} />
                </div>

                {/* Generated Images */}
                <GeneratedImages userId={session.user.id} />
            </div>
        </main>
    );
}