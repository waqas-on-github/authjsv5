import LoginForm from "@/components/login-form";
import LoginWithCreditials from "@/components/loginCrediantals";
import { Suspense } from "react";


const LoginPage = () => {
    return (
        <Suspense fallback={<>loding login page ....</>}>
            <LoginWithCreditials />
            <LoginForm />  
        </Suspense>
    );
}

export default LoginPage; 