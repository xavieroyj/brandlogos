"use client";

import { ArrowRight, Menu, Sparkles, X, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NavHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
            <nav>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center space-x-3">
                                <Sparkles className="h-6 w-6 text-purple-500" />
                                <span className="text-xl font-bold text-white">
                                    BrandLogos
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            <Link href="/#features" className="text-sm text-gray-300 hover:text-white">Features</Link>
                            <Link href="/#pricing" className="text-sm text-gray-300 hover:text-white">Pricing</Link>
                            <Link href="/#how-it-works" className="text-sm text-gray-300 hover:text-white">How it Works</Link>
                            <Link href="/#faq" className="text-sm text-gray-300 hover:text-white">FAQ</Link>
                        </div>

                        {/* Desktop CTA or User Menu */}
                        <div className="hidden md:flex md:items-center md:space-x-6">
                            {isPending ? (
                                <div className="h-8 w-8 rounded-full bg-gray-800" />
                            ) : session?.user ? (
                                <div className="flex items-center space-x-4">
                                    <Button
                                        onClick={handleSignOut}
                                        variant="outline"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Sign out</span>
                                    </Button>
                                    <Button>
                                        <UserIcon className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Link 
                                        href="/auth?tab=login" 
                                        className="text-sm text-gray-300 hover:text-white"
                                    >
                                        Sign in
                                    </Link>
                                    <Link 
                                        href="/auth?tab=signup" 
                                        className="inline-flex items-center rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-400"
                                    >
                                        Get started
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <span className="sr-only">Open menu</span>
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            <Link href="/#features" className="block px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">Features</Link>
                            <Link href="/#pricing" className="block px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">Pricing</Link>
                            <Link href="/#how-it-works" className="block px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">How it Works</Link>
                            <Link href="/#faq" className="block px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">FAQ</Link>
                            
                            <div className="border-t border-white/10 pt-4 pb-3">
                                {session?.user ? (
                                    <>
                                        <div className="px-3 py-2">
                                            <p className="text-base text-gray-300">
                                                {session.user.name || session.user.email}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleSignOut}
                                            variant="outline"
                                        >
                                            Sign out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/auth?tab=login" 
                                            className="block px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
                                        >
                                            Sign in
                                        </Link>
                                        <Link 
                                            href="/auth?tab=signup"
                                            className="block px-3 py-2 text-base font-medium text-white bg-purple-500 hover:bg-purple-400 rounded-md"
                                        >
                                            Get started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}