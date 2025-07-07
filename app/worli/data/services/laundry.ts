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
}

export const vendors: Vendor[] = [
  {
    name: 'Jays Laundry',
    services: [{
      name: 'Steam Iron',
      description: 'Clothes washed, ironed and folded',
      price: '₹99',
      unit: 'kg'
    }],
    mobile: '+91 9892826805'
  },
{
  name: 'Bubble Drycleaning',
  services: [{
    name: 'Dryclean & Steam Press',
    description: 'Dryclean & Steam Press',
    price: 'Call for price',
    unit: 'kg'
  }],
  mobile: '+91 98670 52464'
}
]; 