'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const searchSchema = z.object({
    city: z.string().optional(),
    district: z.string().optional(),
    neighborhood: z.string().optional(),
    type: z.enum(['tümü', 'kiralık', 'satılık']).default('tümü'),
    propertyType: z.enum(['tümü', 'daire', 'villa', 'arsa']).default('tümü'),
    minPrice: z.number().optional().nullable(),
    maxPrice: z.number().optional().nullable(),
});

const antalyaDistricts = [
    'Muratpaşa',
    'Konyaaltı',
    'Kepez',
    'Lara',
    'Alanya',
];
const konyaaltiNeighborhoods = ['Gürsu', 'Liman', 'Hurma'];

export default function SearchSection() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            city: 'Antalya',
            minPrice: null,
            maxPrice: null,
        },
    });

    const onSubmit = (data: z.infer<typeof searchSchema>) => {
        const queryParams = new URLSearchParams();

        if (data.city) queryParams.append('city', data.city);
        if (data.district && data.district !== 'tümü') queryParams.append('district', data.district);
        if (data.neighborhood && data.neighborhood !== 'tümü') queryParams.append('neighborhood', data.neighborhood);
        if (data.type !== 'tümü') queryParams.append('type', data.type);
        if (data.propertyType !== 'tümü') queryParams.append('propertyType', data.propertyType);
        if (data.minPrice) queryParams.append('minPrice', data.minPrice.toString());
        if (data.maxPrice) queryParams.append('maxPrice', data.maxPrice.toString());

        router.push(`/properties/listing?${queryParams.toString()}`);
    };

    return (
        <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Hayalinizdeki Emlak Tek Tıkla Kapınızda
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
                Geniş emlak portföyümüzde aradığınızı bulun.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto flex flex-wrap gap-4 justify-center items-end">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2 text-left">Şehir</label>
                    <input
                        type="text"
                        id="city"
                        readOnly
                        placeholder="Antalya"
                        {...register('city')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    />
                </div>
                <div className="min-w-[120px]">
                    <label htmlFor="district" className="block text-gray-700 text-sm font-bold mb-2 text-left">Semt</label>
                    <select
                        id="district"
                        {...register('district')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="tümü">Tümü</option>
                        {antalyaDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="min-w-[120px]">
                    <label htmlFor="neighborhood" className="block text-gray-700 text-sm font-bold mb-2 text-left">Mahalle</label>
                    <select
                        id="neighborhood"
                        {...register('neighborhood')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="tümü">Tümü</option>
                        {konyaaltiNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
                <div className="min-w-[120px]">
                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2 text-left">İlan Tipi</label>
                    <select
                        id="type"
                        {...register('type')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="tümü">Tümü</option>
                        <option value="kiralık">Kiralık</option>
                        <option value="satılık">Satılık</option>
                    </select>
                </div>
                <div className="min-w-[120px]">
                    <label htmlFor="propertyType" className="block text-gray-700 text-sm font-bold mb-2 text-left">Emlak Tipi</label>
                    <select
                        id="propertyType"
                        {...register('propertyType')}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="tümü">Tümü</option>
                        <option value="daire">Daire</option>
                        <option value="villa">Villa</option>
                        <option value="arsa">Arsa</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                    <label htmlFor="minPrice" className="block text-gray-700 text-sm font-bold mb-2 text-left">Min. Fiyat</label>
                    <input
                        type="number"
                        id="minPrice"
                        placeholder="Min Fiyat"
                        {...register('minPrice', { valueAsNumber: true })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex-1 min-w-[120px]">
                    <label htmlFor="maxPrice" className="block text-gray-700 text-sm font-bold mb-2 text-left">Max. Fiyat</label>
                    <input
                        type="number"
                        id="maxPrice"
                        placeholder="Max Fiyat"
                        {...register('maxPrice', { valueAsNumber: true })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 min-w-[100px] flex items-center justify-center"
                >
                    <span className="material-icons mr-2">search</span> Ara
                </button>
            </form>
        </div>
    );
}