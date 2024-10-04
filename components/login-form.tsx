'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { loginAction } from "@/actions/login"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { signInSchema } from "@/schema/userSchema"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useRef } from "react"

export default function LoginForm() {
    console.log('form renderd ');

    const params = useSearchParams()
    const hasShownToast = useRef(false);
    const router = useRouter()

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


    const { status } = useSession();
    const { register, trigger, reset, formState: { errors }, getValues } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema)
    });

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

    const submit = async () => {
        const val = await trigger();
        if (!val) {
            console.log("Form validation failed:", errors);
            return;
        }

        const inputValues = getValues();
        if (inputValues) {
            const resp = await loginAction(inputValues);
            console.log(resp);
            reset();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <form onSubmit={submit} className="flex flex-col items-center justify-center gap-5">
                <div>
                    <label htmlFor="email">Email</label>
                    <Input type="email" {...register('email')} />
                    {errors?.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <Input type="password" {...register('password')} />
                    {errors?.password && <span className="text-sm text-red-400">{errors.password.message}</span>}
                </div>
                <Button className="text-black bg-white">Submit</Button>
            </form>

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
