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
  photo?: string;
}

export const vendors: Vendor[] = [
  {
    name: 'C. G. Bafna, B.Com/LLB',
    services: [{
      name: 'Document Notarization',
      description: 'Legal document notarization and attestation services',
      price: 'Call for price',
      unit: 'per document'
    }],
    mobile: '+91 7738666394 / 9869149880',
    photo: '/Notary_CGBafna.jpeg'
  },
  {
    name: 'R K Gupta',
    services: [{
      name: 'Document Notarization',
      description: 'Legal document notarization and attestation services',
      price: 'Call for price',
      unit: 'per document'
    }],
    mobile: '+91 9870138183',
  }
];
