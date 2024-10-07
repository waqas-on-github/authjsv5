'use client'
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { z } from "zod"
import { NewPasswordSchema } from "@/schema/userSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@/actions/resetPassword"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"




const ResetForm = ({ token }: { token: string }) => {

    const router = useRouter()
    const { register, trigger, getValues, reset, formState: { errors } } = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema)
    })




    const { mutateAsync, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess(data) {
            if (data.success) {
                toast.success(data.data.successMesage)
                router.push('/auth/login')
            }
            if (!data.success) {
                toast.error(data.error.errorMessage)
            }
        },
        onError(error) {
            toast.error(error.message)
        }
    })




    const submit = async () => {
        const val = await trigger()
        if (!val) {
            console.log("update pass form is not triggerd");
            return
        }

        const { password } = getValues()
        console.log(password);
        mutateAsync({ password, token })
        reset()

    }


    return (
        <form action={submit}>

            <div>
                <Label>new Password</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <span className='text-red-500 text-sm' >{errors.password.message}</span>}

            </div>
            <div>
                {isPending ?
                    <Button disabled>updating ....</Button>
                    :
                    <Button type="submit" >update</Button>
                }
            </div>
            <div>
                <Link href='/auth/login' >back to login </Link>
            </div>
        </form>
    )
}

export default ResetForm