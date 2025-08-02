'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '@/api/auth.service';
import Link from 'next/link';

const registerSchema = z.object({
    username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalı'),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: z.string().min(6, 'Parola en az 6 karakter olmalı'),
});

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await AuthService.register(data.username, data.email, data.password);
            setSuccess('Kaydınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Kayıt başarısız oldu.');
            console.error('Kayıt Hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Kaydol</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

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
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-posta</label>
                    <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
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
                        {loading ? 'Kaydolunuyor...' : 'Kaydol'}
                    </button>
                    <Link href="/auth/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Zaten hesabın var mı? Giriş Yap
                    </Link>
                </div>
            </form>
        </div>
    );
}