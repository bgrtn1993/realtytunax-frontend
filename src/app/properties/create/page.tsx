'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropertyService } from '@/api/property.service';
import AuthGuard from '@/components/AuthGuard';
import axios from 'axios';
import { AuthService } from '@/api/auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const createPropertySchema = z.object({
    title: z.string().min(1, 'Başlık gerekli'),
    description: z.string().min(1, 'Açıklama gerekli'),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Geçerli bir fiyat girin').transform(Number),
    location: z.string().min(1, 'Konum gerekli'),
});

function CreatePropertyContent() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [photo, setPhoto] = useState<File | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(createPropertySchema),
        defaultValues: formData,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPhoto(e.target.files[0]);
        }
    };

    const onSubmit = async (data: z.infer<typeof createPropertySchema>) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const token = AuthService.getToken();
        if (!token) {
            setError('Oturum açmanız gerekiyor.');
            router.push('/auth/login');
            setLoading(false);
            return;
        }

        try {
            let photoUrl = '';
            if (photo) {
                const formData = new FormData();
                formData.append('file', photo);

                const uploadResponse = await axios.post(`${API_BASE_URL}/properties/upload-photo`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                photoUrl = uploadResponse.data.fileUrl;
            }

            const newPropertyData = {
                ...data,
                photos: photoUrl ? [photoUrl] : [],
            };

            await PropertyService.createProperty(newPropertyData, token);
            setSuccess('Emlak başarıyla eklendi!');
            router.push('/properties/listing');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Emlak eklenirken bir hata oluştu.');
            console.error('Emlak ekleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Yeni Emlak Ekle</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

                <div className="mb-6">
                    <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">Fotoğraf Yükle</label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {photo && <p className="mt-2 text-sm text-gray-500">Seçilen dosya: {photo.name}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Ekleniyor...' : 'Emlak Ekle'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function CreatePropertyPageWrapper() {
    return (
        <AuthGuard>
            <CreatePropertyContent />
        </AuthGuard>
    );
}
    