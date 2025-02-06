import { Sparkles, ArrowRight, Zap } from "lucide-react"
import Link from "next/link";
import { Button } from "../ui/button";
export default function Hero() {
    return (
        <div>
            {/* Content */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                {/* Glowing badge */}
                <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center justify-between px-3 py-1 rounded-full
                    bg-black/10 backdrop-blur-sm
                    ring-2 ring-transparent
                    [background:linear-gradient(theme(colors.black/80),theme(colors.black/80))_padding-box,linear-gradient(to_right,#9333ea,#db2777)_border-box]
                    shadow-[0_0_20px_rgba(147,51,234,0.7)] 
                    hover:shadow-[0_0_40px_rgba(219,39,119,0.8)]
                    transition-all duration-500 cursor-pointer">
                        <Sparkles className="mr-2 h-4 w-4 text-white/90" />
                        <span className="text-sm font-semibold text-white/90">
                            AI-Powered Logo Generation
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 text-white/90" />
                    </div>

                    <h1 className="pt-8 text-4xl font-bold tracking-tight sm:text-6xl bg-purple-400 text-transparent bg-clip-text animate-gradient">
                        Get Beautiful Icons Tailored For You
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Generate unique, professional logos instantly. Get both high-resolution originals and ready-to-use favicons. Perfect for brands, websites, and apps.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button className="rounded-full">
                            <Zap className="h-4 w-4" />
                            Generate Your Logo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}