"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams, useRouter } from "next/navigation";

export function AuthTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  const handleTabChange = (value: string) => {
    router.push(`/auth?tab=${value}`);
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </Card>
  );
} 