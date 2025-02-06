import { ArrowRight, Paintbrush, Download, Palette } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-400">
            How It Works
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Create beautiful brand logos in three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Paintbrush className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Describe Your Brand</h3>
            <p className="text-gray-400 text-center">
              Tell us about your brand's personality, values, and target audience
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">AI Generation</h3>
            <p className="text-gray-400 text-center">
              Our AI creates multiple unique logo concepts based on your description
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Download & Use</h3>
            <p className="text-gray-400 text-center">
              Download your chosen logo in multiple formats ready for use
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}