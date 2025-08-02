'use client';

import { useState, useEffect } from 'react';
import { PropertyService } from '@/api/property.service';
import { Property } from '@/common/types';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import SearchSection from "@/components/SearchSection";

interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    link: string;
}

export default function Home() {
    const [searchLocation, setSearchLocation] = useState('');
    const [searchPriceMin, setSearchPriceMin] = useState('');
    const [searchPriceMax, setSearchPriceMax] = useState('');
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [errorFeatured, setErrorFeatured] = useState<string | null>(null);

    const newsArticles: NewsArticle[] = [
        {
            id: '1',
            title: 'Emlak Piyasasında Son Durum',
            summary: 'Konut fiyatlarındaki artış devam ediyor, kiralık piyasası da hareketli.',
            imageUrl: '/news1.jpg',
            link: '#',
        },
        {
            id: '2',
            title: 'Kentsel Dönüşüm Projeleri Hız Kazanıyor',
            summary: 'Büyük şehirlerde kentsel dönüşüm projeleriyle yeni yaşam alanları oluşuyor.',
            imageUrl: '/news2.jpg',
            link: '#',
        },
        {
            id: '3',
            title: 'Yatırım İçin En Cazip Bölgeler',
            summary: 'Uzmanlar, emlak yatırımı için potansiyeli yüksek bölgeleri açıklıyor.',
            imageUrl: '/news3.jpg',
            link: '#',
        },
    ];

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                const allProperties = await PropertyService.getAllProperties();
                setFeaturedProperties(allProperties.slice(0, 3));
            } catch (err) {
                setErrorFeatured('Öne çıkan emlaklar yüklenirken bir hata oluştu.');
                console.error('API Hatası:', err);
            } finally {
                setLoadingFeatured(false);
            }
        };
        fetchFeaturedProperties();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        if (searchLocation) queryParams.append('location', searchLocation);
        if (searchPriceMin) queryParams.append('minPrice', searchPriceMin);
        if (searchPriceMax) queryParams.append('maxPrice', searchPriceMax);

        alert(`Arama Yapıldı:\nKonum: ${searchLocation}\nMin Fiyat: ${searchPriceMin}\nMax Fiyat: ${searchPriceMax}`);
    };

    return (
        <main className="min-h-screen bg-gray-100">
            <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32 flex items-center justify-center">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                >
                    <source src="/Antalya_Cityscape_Video_Generation.mp4" type="video/mp4" />
                    Tarayıcınız video etiketini desteklemiyor.
                </video>
                <div className="container mx-auto text-center px-4 z-99">
                    <SearchSection></SearchSection>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">Öne Çıkan Emlaklar</h2>
                    {loadingFeatured ? (
                        <div className="text-center text-gray-600">Öne çıkan emlaklar yükleniyor...</div>
                    ) : errorFeatured ? (
                        <div className="text-center text-red-500">{errorFeatured}</div>
                    ) : featuredProperties.length === 0 ? (
                        <div className="text-center text-gray-600">Henüz öne çıkan emlak bulunamadı.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-10">
                        <Link href="/properties/listing" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
                            Tüm Emlakları Gör
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">Emlak Dünyasından Son Haberler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsArticles.map((article) => (
                            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{article.title}</h3>
                                    <p className="text-gray-600 mb-4">{article.summary}</p>
                                    <Link href={article.link} className="text-blue-500 hover:underline font-medium">
                                        Devamını Oku
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-gray-800 text-white py-8 text-center">
                <div className="container mx-auto">
                    <p>&copy; {new Date().getFullYear()} RealtyTunax. Tüm Hakları Saklıdır.</p>
                </div>
            </footer>
        </main>
    );
}