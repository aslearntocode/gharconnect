import React from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiMapPin, 
  FiDollarSign, 
  FiLayers,
  FiTruck,
  FiClock,
  FiStar,
  FiHeart,
  FiShield,
  FiWifi,
  FiDroplet,
  FiZap,
  FiThermometer,
  FiBookOpen,
  FiCoffee,
  FiSmile
} from 'react-icons/fi';
import { Apartment } from '@/types/apartment';

interface PropertyDetailGridProps {
  apartment: Apartment;
}

interface GridItem {
  icon: React.ReactNode;
  primaryText: string;
  secondaryText: string;
}

export default function PropertyDetailGrid({ apartment }: PropertyDetailGridProps) {
  // Helper function to format availability date
  const getAvailabilityText = (availableFrom?: string) => {
    if (!availableFrom) return 'Immediately';
    
    const availableDate = new Date(availableFrom);
    const today = new Date();
    
    // If the date has already passed, show immediate possession
    if (availableDate <= today) {
      return 'Immediately';
    }
    
    // Otherwise show the formatted date
    return availableDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper function to get BHK count from apartment type
  const getBHKCount = (apartmentType: string) => {
    const bhkMatch = apartmentType.match(/(\d+(?:\.\d+)?)BHK/);
    if (bhkMatch) {
      const count = parseFloat(bhkMatch[1]);
      return count === 1 ? '1 Bedroom' : `${Math.floor(count)} Bedroom`;
    }
    return apartmentType;
  };

  // Helper function to get parking text
  const getParkingText = (parkingAvailable: boolean, parkingType?: string) => {
    if (!parkingAvailable) return 'Not Available';
    if (parkingType === '2-wheeler') return 'Bike Only';
    if (parkingType === '4-wheeler') return 'Bike and Car'; // Changed from 'Car Only' to 'Bike and Car'
    if (parkingType === 'Both') return 'Bike and Car';
    return 'Available';
  };

  // Helper function to get building age (mock data - you can add this field to your database)
  const getBuildingAge = () => {
    // This is mock data - you can add building_age field to your database
    const ages = ['1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'];
    return ages[Math.floor(Math.random() * ages.length)];
  };

  // Helper function to get balcony count from apartment data
  const getBalconyCount = () => {
    if (apartment.balcony_count !== undefined && apartment.balcony_count !== null) {
      return apartment.balcony_count.toString();
    }
    // Fallback to mock data if balcony_count is not available
    const counts = ['0', '1', '2', '3'];
    return counts[Math.floor(Math.random() * counts.length)];
  };

  const gridItems: GridItem[] = [
    {
      icon: <FiHome className="w-5 h-5" />,
      primaryText: getBHKCount(apartment.apartment_type),
      secondaryText: 'No. of Bedroom'
    },
    {
      icon: <FiLayers className="w-5 h-5" />,
      primaryText: apartment.apartment_type || 'Apartment',
      secondaryText: 'Property Type'
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      primaryText: apartment.preferred_tenant_type || 'Any',
      secondaryText: 'Preferred Tenant'
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      primaryText: getAvailabilityText(apartment.available_from),
      secondaryText: 'Possession'
    },
    {
      icon: <FiTruck className="w-5 h-5" />,
      primaryText: getParkingText(apartment.parking_available, apartment.parking_type),
      secondaryText: 'Parking'
    },
    {
      icon: <FiClock className="w-5 h-5" />,
      primaryText: getBuildingAge(),
      secondaryText: 'Age of Building'
    },
    {
      icon: <FiStar className="w-5 h-5" />,
      primaryText: getBalconyCount(),
      secondaryText: 'Balcony'
    },
    {
      icon: <FiCalendar className="w-5 h-5" />,
      primaryText: apartment.created_at ? new Date(apartment.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) : 'N/A',
      secondaryText: 'Posted On'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
      <div className="grid grid-cols-2 gap-4">
        {gridItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">
                {item.primaryText}
              </div>
              <div className="text-xs text-gray-500">
                {item.secondaryText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 