import ResetForm from '@/components/resetForm'
import React from 'react'

const page = ({ searchParams }: { searchParams: { token: string } }) => {

    const { token } = searchParams

    return (
        <ResetForm token={token} />
    )
}

export default page