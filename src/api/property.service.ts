import axios from 'axios';
import { Property } from '@/common/types';

interface CreatePropertyRequest {
    title: string;
    description: string;
    price: number;
    location: string;
}

export interface FilterLookupData {
    districts: string[];
    neighborhoods: { [district: string]: string[] };
    propertyTypes: string[];
    listingTypes: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const PropertyService = {
    getAllProperties: async (query: Record<string, string>): Promise<Property[]> => {
        const response = await axios.get(`${API_BASE_URL}/properties`, { params: query });
        return response.data;
    },

    async getPropertyById(id: string): Promise<Property> {
        const response = await axios.get<Property>(`${API_BASE_URL}/properties/${id}`);
        return response.data;
    },

    getFilterLookupData: async (): Promise<FilterLookupData> => {
        const response = await axios.get(`${API_BASE_URL}/properties/lookup-data`);
        return response.data;
    },

    async createProperty(propertyData: CreatePropertyRequest, token: string): Promise<Property> {
        const response = await axios.post<Property>(`${API_BASE_URL}/properties`, propertyData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    async updateProperty(id: string, propertyData: Partial<CreatePropertyRequest>, token: string): Promise<Property> {
        const response = await axios.put<Property>(`${API_BASE_URL}/properties/${id}`, propertyData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    async deleteProperty(id: string, token: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/properties/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};