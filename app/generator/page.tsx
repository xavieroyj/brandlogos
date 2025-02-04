import BrandForm from "@/components/BrandForm";

export default function Home() {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center">BrandLogos</h1>
      <BrandForm />
      <footer className="mt-8 text-sm text-muted-foreground text-center">
        Powered by Next.js and ShadcnUI
      </footer>
    </div>
  );
}