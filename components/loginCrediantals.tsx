'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { signInSchema } from "@/schema/userSchema"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { loginAction } from "@/actions/login"


export default function LoginWithCreditials() {

    const { register, trigger, reset, formState: { errors }, getValues } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema)
    });






    const { mutate, isPending } = useMutation({

        mutationFn: loginAction,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.data.successMesage)


            }

            if (!data.success) {
                toast.error(data.error.errorMessage)
            }
        }
        , onError(error) {
            toast.error(error.message)

        },

    })







    const submit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        const val = await trigger();
        if (!val) {
            console.log("Form validation failed:", errors);
            return;
        }

        const inputValues = getValues();
        if (inputValues) {
            mutate(inputValues);

            reset();
        }
    };




    return (

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
            {
                isPending ?
                    <Button disabled className="text-black bg-white">Submiting .....</Button>
                    :
            <Button className="text-black bg-white">Submit</Button>
            }

        </form>


    )
}
