'use client';

import { useEffect, useState, useMemo } from 'react';
import { PropertyService, FilterLookupData } from '@/api/property.service';
import { Property } from '@/common/types';
import PropertyCard from '@/components/PropertyCard';
import { useSearchParams } from 'next/navigation';
import FilterSection from '@/components/FilterSection';

export default function PropertyListingPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [lookupData, setLookupData] = useState<FilterLookupData | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();

    const queryParams = useMemo(() => {
        return Object.fromEntries(searchParams.entries());
    }, [searchParams]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [propertiesData, lookupData] = await Promise.all([
                    PropertyService.getAllProperties(queryParams),
                    PropertyService.getFilterLookupData()
                ]);

                setProperties(propertiesData);
                setLookupData(lookupData);

            } catch (err) {
                setError('Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                console.error('API Hatası:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [queryParams]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Tüm Emlaklar</h1>

            {loading ? (
                <div className="text-center p-10 text-lg">Yükleniyor...</div>
            ) : error ? (
                <div className="text-center p-10 text-red-500 text-lg">{error}</div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/4 lg:w-1/5">
                        <FilterSection lookupData={lookupData} />
                    </aside>

                    <main className="w-full md:w-3/4 lg:w-4/5">
                        {properties.length === 0 ? (
                            <div className="text-center p-10 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-700">Sonuç Bulunamadı</h3>
                                <p className="text-gray-500 mt-2">Aradığınız kriterlere uygun emlak bulunamadı. Lütfen filtrelerinizi değiştirip tekrar deneyin.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}