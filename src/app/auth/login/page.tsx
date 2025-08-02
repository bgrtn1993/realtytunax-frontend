'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/api/auth.service';
import Link from 'next/link';

const loginSchema = z.object({
    username: z.string().min(1, 'Kullanıcı adı gerekli'),
    password: z.string().min(1, 'Parola gerekli'),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.login(data.username, data.password);
            AuthService.setToken(response.access_token);
            router.push('/properties/listing');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Giriş başarısız oldu.');
            console.error('Giriş Hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Giriş Yap</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Kullanıcı Adı</label>
                    <input
                        type="text"
                        id="username"
                        {...register('username')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
                    />
                    {errors.username && <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>}
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Parola</label>
                    <input
                        type="password"
                        id="password"
                        {...register('password')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                    <Link href="/auth/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Hesabın yok mu? Kaydol
                    </Link>
                </div>
            </form>
        </div>
    );
}