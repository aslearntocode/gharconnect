export interface Product {
  name: string;
  description: string;
  price: number | string;
  unit: string;
}

export interface Vendor {
  name: string;
  products: Product[];
  mobile: string;
  photo?: string;
  areaServed?: string[];
  buildingServed?: string[];
}

export const vendors: Vendor[] = [
  {
    name: 'Manilal Vegetable Shop',
    products: [{
      name: 'Vegetables',
      description: 'Farm fresh vegetables',
      price: "Call for price",
      unit: 'gms'
    }],
    mobile: '+91 98923 53874 / 79923 34717',
    areaServed: ['Parel','Worli','Byculla','Dadar'],
    buildingServed: ['All']
  }
]; 