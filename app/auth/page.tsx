import { Suspense } from "react";
import { AuthTabs } from "@/components/auth/AuthTabs";

export default function AuthPage() {
	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<AuthTabs />
			</Suspense>
		</div>
	);
}