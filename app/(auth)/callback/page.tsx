import { Suspense } from "react";
import OAuthCallback from "@/components/auth/callback";
import { Loader2 } from "lucide-react";

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#D8D8D8]">
                    <Loader2 className="h-10 w-10 animate-spin text-[#4B3BFB]" />
                </div>
            }
        >
            <OAuthCallback />
        </Suspense>
    );
}
