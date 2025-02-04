import { Github, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (<footer className="bg-black border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                {/* Logo and description */}
                <div className="col-span-2 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-6">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                        <span className="text-xl font-bold">LogoAI</span>
                    </div>
                    <p className="text-gray-400 mb-6">
                        Create stunning, professional logos in seconds with the power of AI. Perfect for businesses, startups, and personal brands.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-6 w-6" />
                        </a>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-sm font-semibold text-white mb-6">Product</h3>
                    <ul className="space-y-4">
                        <li><Link href="/#features" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
                        <li><Link href="/#pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                        <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Enterprise</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white mb-6">Company</h3>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-white mb-6">Resources</h3>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Help Center</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a></li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
                <p className="text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} BrandLogos. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
    );
}