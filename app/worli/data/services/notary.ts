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
    name: 'Advocate Rajesh Kumar',
    services: [{
      name: 'Document Notarization',
      description: 'Legal document notarization and attestation services',
      price: '₹500',
      unit: 'per document'
    }],
    mobile: '+91 0000000000'
  }
];
