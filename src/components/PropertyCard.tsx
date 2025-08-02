import Image from 'next/image';
import { Property } from '@/common/types';
import Link from 'next/link';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    if (!property) {
        return null;
    }
    const formattedPrice = property.price ? `$${property.price.toLocaleString()}` : 'Fiyat Belirtilmemiş';

    return (
        <Link href={`/properties/listing/${property._id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <Image
                    src="/placeholder.jpg"
                    alt={`Emlak görseli: ${property.title}`}
                    width={600}
                    height={400}
                    layout="responsive"
                    className="w-full h-48 object-cover"
                />
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{property.title || 'Başlık Yok'}</h2>
                    <p className="text-gray-600 mb-1">Konum: {property.location || 'Konum Yok'}</p>
                    <p className="text-blue-600 text-lg font-bold">{formattedPrice}</p>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;