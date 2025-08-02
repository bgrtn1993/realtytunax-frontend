'use client';
import Link from 'next/link';
import { AuthService } from '@/api/auth.service';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsAuthenticated(AuthService.isAuthenticated());
    }, []);

    const handleLogout = () => {
        AuthService.removeToken();
        setIsAuthenticated(false);
        router.push('/auth/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    RealtyTunax
                </Link>
                <div>
                    <Link href="/properties/listing" className="mr-4 hover:text-gray-300">
                        Emlaklar
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link href="/properties/create" className="mr-4 hover:text-gray-300">
                                Yeni Emlak Ekle
                            </Link>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline">
                                Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="mr-4 hover:text-gray-300">
                                Giriş Yap
                            </Link>
                            <Link href="/auth/register" className="hover:text-gray-300">
                                Kaydol
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;