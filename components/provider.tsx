// components/provider.tsx
'use client'; // Ensure this is at the top

import { SessionProvider } from "next-auth/react";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    );
};
