'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/api/auth.service';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            router.push('/auth/login');
        }
    }, [router]);

    if (!AuthService.isAuthenticated()) {
        return <div className="text-center p-4">Giriş yapılıyor... Yönlendiriliyorsunuz...</div>;
    }

    return <>{children}</>;
};

export default AuthGuard;