'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signInSchema } from "@/lib/signinSchema"
import { loginAction } from "@/actions/login"
import { Input } from "./ui/input"
import { Button } from "./ui/button"



export default function LoginForm() {

    const { register, trigger, reset, formState: { errors }, getValues } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema)
    })

    const submit = async () => {
        // trigger a userform to get values
        const val = await trigger()
        if (!val) {
            console.log("form not triggerd. trigger value -->", val);
            console.log(errors);

            return

        }
        // get input values 
        const inputValues = getValues()  //these value are viladated buy zod 

        console.log(inputValues);


        if (inputValues) {
            // sanitize data before sending to server 

            loginAction(inputValues)
        }


        reset()
    }



    return (
        <form action={submit} className="flex flex-col items-center justify-center gap-5" >
            <div>
                <label htmlFor="email">email</label>
                <Input type="email" {...register('email')} />
                {errors?.email && <span className="text-sm text-red-400">{errors?.email?.message}</span>}

            </div>

            <div>
                <label htmlFor="password">password </label>
                <Input type="password" {...register('password')} />
                {errors?.password && <span className="text-sm text-red-400">{errors?.password?.message}</span>}

            </div>
            <Button className="text-black bg-white " >submit</Button>

        </form>
    )
} 