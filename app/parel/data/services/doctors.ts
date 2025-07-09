export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  address: string;
  phone: string;
  timing: string;
  society: string;
  consultationFee: string;
  languages: string[];
  areaServed?: string[];
  buildingServed?: string[];
}



export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Ameet Mandot",
    specialization: "The Gut Clinic",
    qualification: "MBBS, MD, DNB Gastroenterology",
    experience: "24 years",
    address: "Parel, Mumbai",
    phone: "+91 84510 10330",
    timing: "Mon-Sat: 9 AM - 1 PM, 4 PM - 8 PM",
    society: "Parel",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "2",
    name: "Dr. Cyrus Contractor",
    specialization: "Paediatrician",
    qualification: "MBBS, DCH",
    experience: "20 years",
    address: "Dadar, Mumbai",
    phone: "+91 2224149581 / 98201 42430",
    timing: "Mon-Sat: 10 AM - 2 PM, 5 PM - 9 PM",
    society: "Dadar",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Gujarati"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "3",
    name: "Krishna Eye Centre",
    specialization: "Paediatrician Eye Care",
    qualification: "MBBS, DCH",
    experience: "20 years",
    address: "Parel, Mumbai",
    phone: "+91 84476 37606",
    timing: "Mon-Sun",
    society: "Parel",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "4",
    name: "Dr. Kinjal Jain - Smiles Dental Care",
    specialization: "Dental Surgeon",
    qualification: "BDS",
    experience: "10+ years",
    address: "Parel, Mumbai",
    phone: "+91 88505 01259",
    timing: "Mon-Sat",
    society: "Parel",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "5",
    name: "Sunanda D",
    specialization: "Nutrition",
    qualification: "M.S. (USA)",
    experience: "10+ years",
    address: "Parel, Mumbai",
    phone: "+91 85911 54545",
    timing: "Mon-Sat",
    society: "Online",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "6",
    name: "Kashish Chimnani",
    specialization: "Nutrition",
    qualification: "M.S.",
    experience: "10+ years",
    address: "Online",
    phone: "+91 99206 95556",
    timing: "Mon-Sat",
    society: "Online",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "7",
    name: "Shivani Kapadia",
    specialization: "Clinical Psychologist, Counsellor",
    qualification: "M.A. (Clinical Psychology), Post Grad in Counselling, Art and Behavioral Therapist",
    experience: "5+ years",
    address: "Parel, Mumbai",
    phone: "+91 87674 70496",
    timing: "Mon-Fri",
    society: "Online or Parel, Mumbai",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi"],
    areaServed: ['All'],
    buildingServed: ['All']
  },
  {
    id: "8",
    name: "Dentist Mitesh Jain",
    specialization: "Dental Surgeon",
    qualification: "BDS",
    experience: "10+ years",
    address: "Parel, Mumbai",
    phone: "+91 80800 09944",
    timing: "Mon-Sat",
    society: "Parel, Mumbai",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"],
    areaServed: ['All'],
    buildingServed: ['All']
  }
];

