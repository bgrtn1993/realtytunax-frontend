'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FilterLookupData } from '@/api/property.service';

const filterSchema = z.object({
    city: z.string().optional(),
    district: z.string().optional(),
    neighborhood: z.string().optional(),
    type: z.enum(['tümü', 'kiralık', 'satılık']).default('tümü'),
    propertyType: z.enum(['tümü', 'daire', 'villa', 'arsa']).default('tümü'),
    minPrice: z.coerce.number().optional().nullable(),
    maxPrice: z.coerce.number().optional().nullable(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface FilterSectionProps {
    lookupData: FilterLookupData | null;
}

export default function FilterSection({ lookupData }: FilterSectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { register, handleSubmit, reset, watch, setValue } = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            city: searchParams.get('city') || 'Antalya',
            district: searchParams.get('district') || 'tümü',
            neighborhood: searchParams.get('neighborhood') || 'tümü',
            type: searchParams.get('type') || 'tümü',
            propertyType: searchParams.get('propertyType') || 'tümü',
            minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
            maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
        },
    });

    const selectedDistrict = watch('district');

    const availableNeighborhoods = selectedDistrict && lookupData?.neighborhoods[selectedDistrict]
        ? lookupData.neighborhoods[selectedDistrict]
        : [];

    useEffect(() => {
        setValue('neighborhood', 'tümü');
    }, [selectedDistrict, setValue]);

    useEffect(() => {
        const newValues: Partial<FilterFormValues> = {};
        for (const [key, value] of searchParams.entries()) {
            if (key in filterSchema.shape) {
                newValues[key as keyof FilterFormValues] = value as any;
            }
        }
        reset(newValues);
    }, [searchParams, reset]);


    const onSubmit = (data: FilterFormValues) => {
        const queryParams = new URLSearchParams();

        Object.entries(data).forEach(([key, value]) => {
            if (value && value !== 'tümü' && value.toString() !== '') {
                queryParams.set(key, value.toString());
            }
        });

        router.push(`/properties/listing?${queryParams.toString()}`);
    };

    const handleReset = () => {
        reset({
            city: 'Antalya',
            district: 'tümü',
            neighborhood: 'tümü',
            type: 'tümü',
            propertyType: 'tümü',
            minPrice: null,
            maxPrice: null,
        });
        router.push('/properties/listing');
    };

    if (!lookupData) {
        return <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">Yükleniyor...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Filtrele</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Şehir</label>
                    <input id="city" type="text" readOnly value="Antalya" {...register('city')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" />
                </div>

                <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">İlçe</label>
                    <select id="district" {...register('district')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="tümü">Tümü</option>
                        {lookupData.districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Mahalle</label>
                    <select id="neighborhood" {...register('neighborhood')} disabled={!selectedDistrict || selectedDistrict === 'tümü'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100">
                        <option value="tümü">Tümü</option>
                        {availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">İlan Tipi</label>
                    <select id="type" {...register('type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="tümü">Tümü</option>
                        {lookupData.listingTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Emlak Tipi</label>
                    <select id="propertyType" {...register('propertyType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        <option value="tümü">Tümü</option>
                        {lookupData.propertyTypes.map(pt => <option key={pt} value={pt}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</option>)}
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min. Fiyat</label>
                        <input type="number" id="minPrice" placeholder="0" {...register('minPrice')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max. Fiyat</label>
                        <input type="number" id="maxPrice" placeholder="Limitsiz" {...register('maxPrice')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button type="submit" className="w-full sm:w-auto flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">Filtrele</button>
                    <button type="button" onClick={handleReset} className="w-full sm:w-auto flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">Sıfırla</button>
                </div>
            </form>
        </div>
    );
}