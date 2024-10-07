'use client'
import { verifyToken } from "@/actions/verifyToken"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"


const Verify = ({ token }: { token: string }) => {

    const router = useRouter()

    const { mutate, isPending } = useMutation({
        mutationFn: verifyToken,

        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.data.successMesage)
                router.push('/settings')

            }

            if (!data.success) {
                toast.error(data.error.errorMessage)
            }


        },

        onError: (error) => {
            toast.error(error.message)
        }
    })




    useEffect(() => {
        mutate(token)
    }, [token, mutate])



    return (
        <div>{isPending ? <> verifiying ...</> : <>email verified </>}</div>
    )
}

export default Verify