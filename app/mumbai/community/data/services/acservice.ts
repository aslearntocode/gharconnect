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
  areaServed?: string[];
  buildingServed?: string[];
}
  
  export const acServiceServices: Vendor[] = [
    {
      name: 'Azhar Ali',
      products: [{
        name: 'AC Service',
        description: 'All types of AC service',
        price: 'Call for price',
        unit: 'job'
      }],
      mobile: '+91 84549 87547',
      areaServed: ['Parel','Worli'],
      buildingServed: ['All']
    },
    {
      name: 'Hamid',
      products: [{
        name: 'AC Service',
        description: 'All types of AC service',
        price: 'Call for price',
        unit: 'job'
      }],
      mobile: '+91 81696 38339',
      areaServed: ['Parel'],
      buildingServed: ['L&T Crescent Bay','Ashok Gardens','ICC']
    }
  ]; 