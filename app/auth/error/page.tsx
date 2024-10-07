import Link from 'next/link';



function AuthErrorPage() {
    return (
        <div>
            <h1>Authentication Error</h1>
            <p>An error occurred during authentication</p>
            <Link href="/auth/login">Go back to login </Link>
        </div>
    );
}

export default AuthErrorPage
