import Verify from "@/components/verify"


const Verification = ({ searchParams }: { searchParams: { token: string } }) => {


    const { token } = searchParams

    // 


    return (
        <>
            <Verify token={token} />
        </>
    )
}

export default Verification