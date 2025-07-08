export interface Service {
  name: string;
  description: string;
  price: number | string;
  unit: string;
}

export interface Vendor {
  name: string;
  services: Service[];
  mobile: string;
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Mushir Ali Enterprises',
    services: [{
      name: 'Interior and Exterior Painting',
      description: 'Interior painting for flats',
      price: 'Call for price',
      unit: 'flat'
    }],
    mobile: '+91 90821 56719',
    areaServed: ['Bandra','Mira Road','Malad','Goregaon','Kandivali','Borivali'],
    buildingServed: ['All']
  },
]; 