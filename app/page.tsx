import Hero from "@/components/home/Hero";
import { IconScroller } from "@/components/home/IconScroller";
import Pricing from "@/components/home/Pricing";
import HowItWorks from "@/components/home/HowItWorks";

// Sample icons - in production, these would come from your database
const sampleIcons = [
  { src: "/sample-icons/icon1.svg", alt: "Modern tech icon" },
  { src: "/sample-icons/icon2.svg", alt: "Creative design icon" },
  { src: "/sample-icons/icon3.svg", alt: "Professional brand icon" },
  { src: "/sample-icons/icon4.svg", alt: "Minimalist icon" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <Hero />
      <div className="w-full py-12 overflow-hidden bg-background/50">
        <IconScroller
          icons={sampleIcons}
          speed="slow"
          className="mx-auto"
          pauseOnHover={false}
        />
      </div>
      <HowItWorks />
      <Pricing />
    </div>
  );
}