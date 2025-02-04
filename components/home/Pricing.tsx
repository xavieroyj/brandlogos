import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const pricingData = [
    {
        name: "Starter",
        price: "$0",
        period: "/month",
        description: "Perfect for trying out our AI logo generator",
        features: [
            "5 logo generations per day",
            "Flexible Customization options",
            "Image downloads",
        ],
        popular: false,
    },
    {
        name: "Pro",
        price: "$10",
        period: "/month",
        description: "For those who want more",
        features: [
            "500 logo generations a month",
            "Flexible Customization options",
            "Download ZIP files with all favicon formats",
            "Priority support",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "COMING SOON",
        period: "",
        description: "For businesses and teams",
        features: [
            "Unlimited logo generations",
            "Advanced customization",
            "PNG and SVG downloads",
            "Priority support",
            "Dedicated support",
            "SLA guarantee",
        ],
        popular: false,
    },
];

export default function Pricing() {
    return (<div className="relative mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold mb-16 bg-gradient-primary bg-clip-text text-transparent">
            Simple, transparent pricing
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingData.map((plan, index) => (
                <div
                    key={index}
                    className={`relative flex flex-col overflow-hidden rounded-2xl border ${plan.popular
                        ? 'border-theme-purple bg-theme-purple/10'
                        : 'border-border bg-card'
                        } p-8 transition-all duration-300 hover:border-theme-purple/50`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 rotate-45">
                            <div className="bg-theme-purple text-primary-foreground px-8 py-1 text-sm">Popular</div>
                        </div>
                    )}
                    <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                            <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                        <p className="text-muted-foreground mb-6">{plan.description}</p>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center text-foreground/80">
                                    <CheckCircle2 className="h-5 w-5 text-theme-purple mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link
                        href="/generator"
                        className={`block text-center py-2 px-4 rounded-full transition-colors duration-200 ${plan.popular
                            ? 'bg-theme-purple text-primary-foreground hover:bg-theme-purple/90'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                    >
                        Get started
                    </Link  >
                </div>
            ))}
        </div>
    </div>);
}