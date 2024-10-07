import Link from "next/link"





const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center flex-col">

            <div>
                <Link href='/auth/login'  > login</Link>
                <Link href='/auth/register'  > register</Link>

            </div>

            {children}

        </div>
    )
}

export default layout