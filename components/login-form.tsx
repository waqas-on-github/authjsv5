'use client'
import { Button } from "./ui/button"

import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useRef } from "react"

export default function LoginForm() {




    const params = useSearchParams()
    const hasShownToast = useRef(false);
    const router = useRouter()
    const { status } = useSession();


    useEffect(() => {
        const err = params.get("error")
        if (err === 'OAuthAccountNotLinked' && !hasShownToast.current) {
            toast('You are already registered with the same email to another provider.');
            hasShownToast.current = true;

            const newParams = new URLSearchParams(params.toString());
            newParams.delete('error');
            router.replace(`?${newParams.toString()}`, { scroll: false });
        }
    }, [params, router]);




    const handleSignIn = async () => {
        if (status === "loading") {
            console.warn("Session is still loading, please wait.");
            return;
        }

        try {
            if (status === 'authenticated') {
                await signOut({ redirect: false });
            }

            const data = await signIn('google');
            console.log('Sign-in data:', data);
            if (data?.error) {
                console.error('Sign-in error:', data.error);
            }

        } catch (error) {
            console.error('Unexpected error during sign-in:', error);
        }
    };






    return (
        <div className="flex flex-col items-center justify-center gap-5">


            <Button onClick={(e) => {
                e.preventDefault();
                signIn('github');
            }}>
                <GitHubLogoIcon />
            </Button>

            <Button onClick={handleSignIn}>Google</Button>
        </div>
    );
}
