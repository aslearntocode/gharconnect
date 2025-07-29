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
  whatsappGroup?: string;
  blogLink?: string;
  blogTitle?: string;
}

export const vendors: Vendor[] = [
  {
    name: 'Agarwal Dairy',
    products: [{
      name: 'Cow Milk',
      description: 'Fresh cow milk delivered daily',
      price: 'Call for price',
      unit: 'litre'
    }],
    mobile: '+91 98201 80456 / +91 99304 94032',
    areaServed: ['Parel', 'Worli'],
    buildingServed: ['All']
  },
  {
    name: 'Parsi Dairy in collaboration with GharConnect',
    products: [
      {
        name: 'Cow Milk',
        description: 'Fresh cow milk delivered daily',
        price: 'Call for price',
        unit: 'litre'
      },
      {
        name: 'A2 Cow Milk',
        description: 'Fresh A2 cow milk delivered daily',
        price: 'Call for price',
        unit: 'litre'
      },
      {
        name: 'Buffalo Milk',
        description: 'Fresh buffalo milk delivered daily',
        price: 'Call for price',
        unit: 'litre'
      },
      {
        name: 'Paneer',
        description: 'Fresh paneer delivered daily',
        price: 'Call for price',
        unit: 'gms'
      },
      {
        name: 'Cheese',
        description: 'Fresh cheese delivered daily',
        price: 'Call for price',
        unit: 'gms'
      },
      {
        name: 'Butter',
        description: 'Fresh butter delivered daily',
        price: 'Call for price',
        unit: 'gms'
      },
      {
        name: 'Pure Desi Ghee',
        description: 'Fresh pure desi ghee delivered daily',
        price: 'Call for price',
        unit: 'gms'
      }
    ],
    mobile: '+91 93213 14553',
    areaServed: ['Parel'],
    buildingServed: ['All'],
    whatsappGroup: 'https://chat.whatsapp.com/DC5egpe5FQn7YQTEI9DQg5?mode=ac_t',
    // blogLink: '/mumbai/community/blog/dairy-products-guide',
    // blogTitle: 'Learn about different types of dairy products and their benefits'
  }

]; 