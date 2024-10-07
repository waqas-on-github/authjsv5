'use client'
import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { resetSchema } from '@/schema/userSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { resetPassRequest } from '@/actions/resetPassRequest'
import { toast } from 'sonner'

const ResetRequestForm = () => {

    const { register, reset, trigger, getValues, formState: { errors } } = useForm<z.infer<typeof resetSchema>>({
        resolver: zodResolver(resetSchema)
    })

    const { mutate, isPending } = useMutation({
        mutationFn: resetPassRequest,
        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.data.successMesage)
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
            console.log("form is not triggerd ");
            return
        }

        const { email } = getValues()
        mutate(email)
        reset()


    }

    return (

        <form action={submit}>

            <Label> Email</Label>
            <div>
                <Input type='email' {...register("email")} />
                {errors.email && <span className='text-red-500 text-sm' >{errors.email.message}</span>}
            </div>
            {isPending ?
                <Button type='submit' disabled aria-disabled > Sending .....</Button> :
                <Button type='submit'> Send reset email</Button>
            }
            <div>
                <Link href='/auh/login'> back to login </Link>
            </div>

        </form>
    )
}

export default ResetRequestForm