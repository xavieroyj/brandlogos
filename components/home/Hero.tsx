import { Sparkles, ArrowRight, Zap } from "lucide-react"
export default function Hero() {
    return (
    <div>
        {/* Content */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            {/* Glowing badge */}
            <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 bg-gradient-primary-soft backdrop-blur-sm ring-2 ring-theme-purple/50">
                    <Sparkles className="mr-2 h-4 w-4 text-theme-purple" />
                    <span className="bg-gradient-primary bg-clip-text text-transparent font-medium">
                        AI-Powered Logo Generation
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 text-theme-pink" />
                </div>

                <h1 className="pt-8 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-primary text-transparent bg-clip-text animate-gradient">
                    Create stunning logos with the power of AI
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                    Generate unique, professional logos instantly. Get both high-resolution originals and ready-to-use favicons. Perfect for brands, websites, and apps.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a href="/generator" 
                       className="group relative inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold 
                                focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 
                                bg-theme-purple text-primary-foreground hover:bg-theme-purple/90 
                                active:bg-theme-purple/80 focus-visible:outline-theme-purple 
                                transition-all duration-200">
                        Generate Your Logo
                        <Zap className="ml-2 h-4 w-4" />
                    </a>
                    <a href="#gallery" 
                       className="text-sm font-semibold leading-6 text-foreground 
                                hover:text-theme-purple transition-colors">
                        View Gallery <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    );
}