'use client';

import { useEffect, useState } from 'react';
import { PropertyService } from '@/api/property.service';
import { Property } from '@/common/types';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function PropertyDetailPage() {
    const params = useParams();
    const { id } = params;
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchProperty = async () => {
                try {
                    const data = await PropertyService.getPropertyById(id as string);
                    setProperty(data);
                } catch (err) {
                    setError('Emlak detayları yüklenirken bir hata oluştu.');
                    console.error('API Hatası:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProperty();
        }
    }, [id]);

    if (loading) return <div className="text-center p-4">Emlak Yükleniyor...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
    if (!property) return <div className="text-center p-4">Emlak bulunamadı.</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{property.title}</h1>
                <p className="text-gray-600 text-lg mb-4">
                    <span className="font-semibold">Konum:</span> {property.location}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-6">
                    Fiyat: ${property.price.toLocaleString()}
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                    {property.description}
                </p>
                <Link href="/properties/listing" className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Listeye Geri Dön
                </Link>
            </div>
        </div>
    );
}