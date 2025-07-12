export interface GardenerService {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'landscaping' | 'plants' | 'other';
  mobile: string;
  products: {
    name: string;
    description: string;
    price: number | string;
    unit: string;
  }[];
}

export const gardenerServices: GardenerService[] = [

]; 