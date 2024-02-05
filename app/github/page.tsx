'use client';
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function RedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const url = 'https://github.com/critesjosh/nounish-blockies';

        // Perform the redirect
        // window.location.href = url; // For a full page reload redirect
        // Or use Next.js router for client-side redirect (comment out the line above if using this)
        router.push(url);
    }, [router]);

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
}