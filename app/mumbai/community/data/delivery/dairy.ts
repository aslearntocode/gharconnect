export interface ProductVariety {
  name: string;
  price: number | string;
  unit: string;
}

export interface Product {
  name: string;
  description: string;
  varieties: ProductVariety[];
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
      varieties: [
        {
          name: 'Full Fat',
          price: 'Call for price',
          unit: 'litre'
        },
        {
          name: 'Low Fat',
          price: 'Call for price',
          unit: 'litre'
        }
      ]
    }],
    mobile: '+91 98201 80456 / +91 99304 94032',
    areaServed: ['Parel'],
    buildingServed: ['All']
  },
  {
    name: 'Parsi Dairy in collaboration with GharConnect',
    products: [
      {
        name: 'Cow Milk',
        description: 'Fresh cow milk delivered daily',
        varieties: [
          {
            name: 'Full Fat',
            price: '₹62',
            unit: '500ml'
          }
        ]
      },
      {
        name: 'Buffalo Milk',
        description: 'Fresh buffalo milk delivered daily',
        varieties: [
          {
            name: 'Full Fat',
            price: '₹75',
            unit: '500ml'
          },
          {
            name: 'Low Fat',
            price: '₹66',
            unit: '500ml'
          },
          {
            name: 'No Fat',
            price: '₹64',
            unit: '500ml'
          }
        ]
      },
      {
        name: 'Paneer',
        description: 'Fresh paneer delivered daily',
        varieties: [
          {
            name: 'Classic',
            price: '₹200',
            unit: '200gms'
          },
          {
            name: 'Masala',
            price: '₹220',
            unit: '200gms'
          }
        ]
      },
      {
        name: 'Cream',
        description: 'Fresh cream delivered daily',
        varieties: [
          {
            name: 'Full Fat',
            price: '₹140',
            unit: '200ml'
          }
        ]
      },
      {
        name: 'Butter',
        description: 'Fresh butter delivered daily',
        varieties: [
          {
            name: 'Unsalted White Butter',
            price: '₹690',
            unit: '500gms'
          },
          {
            name: 'Unsalted White Butter',
            price: '₹290',
            unit: '200gms'
          }
        ]
      },
      {
        name: 'Pure Desi Ghee',
        description: 'Fresh pure desi ghee delivered daily',
        varieties: [
          {
            name: 'Cow Ghee',
            price: '₹750',
            unit: '500ml'
          },
          {
            name: 'Buffalo Ghee',
            price: '₹765',
            unit: '500ml'
          },
          {
            name: 'A2 Cow Ghee',
            price: '₹2295',
            unit: '1000ml'
          }
        ]
      },
      {
        name: 'Curd',
        description: 'Fresh curd delivered daily',
        varieties: [
          {
            name: 'Classic Curd',
            price: '₹230',
            unit: '500gms'
          }
        ]
      },
      {
        name: 'Yogurt',
        description: 'Fresh yogurt delivered daily',
        varieties: [
          {
            name: 'Classic Yogurt',
            price: '₹75',
            unit: '90gms'
          },
          {
            name: 'Mango Yogurt',
            price: '₹75',
            unit: '90gms'
          },
          {
            name: 'Blueberry Yogurt',
            price: '₹75',
            unit: '90gms'
          },
          {
            name: 'Strawberry Yogurt',
            price: '₹75',
            unit: '90gms'
          }
        ]
      },
      {
        name: 'Srikhand',
        description: 'Fresh srikhand delivered daily',
        varieties: [
          {
            name: 'Kesar Srikhand',
            price: '₹150',
            unit: '200gms'
          },
          {
            name: 'Mango Srikhand',
            price: '₹150',
            unit: '200gms'
          },
          {
            name: 'Dryfruit Srikhand',
            price: '₹150',
            unit: '200gms'
          },
          {
            name: 'Elaichi Srikhand',
            price: '₹150',
            unit: '200gms'
          }
        ]
      }
    ],
    mobile: '+91 93213 14553',
    areaServed: ['Parel','Worli','Wadala','Chembur','Dadar','Sion','Mahalaxmi','Bandra','Juhu','Powai','Malad','Andheri','Goregaon','Thane'],
    buildingServed: ['All'],
    whatsappGroup: 'https://chat.whatsapp.com/DC5egpe5FQn7YQTEI9DQg5?mode=ac_t',
    // blogLink: '/mumbai/community/blog/dairy-products-guide',
    // blogTitle: 'Learn about different types of dairy products and their benefits'
  }

]; 