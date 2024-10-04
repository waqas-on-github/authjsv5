import Link from 'next/link';

// Define the errorType to have a 'message' property
type ErrorType = {
    message: string;  // Change this to match the expected structure
};

// Define the props for the component
type AuthErrorPageProps = {
    error: ErrorType;  // Use the updated errorType
};

export default function AuthErrorPage({ error }: AuthErrorPageProps) {
    return (
        <div>
            <h1>Authentication Error</h1>
            <p>An error occurred during authentication: {error?.message || 'Unknown error'}</p>
            <Link href="/auth/login">Go back to login </Link>
        </div>
    );
}
