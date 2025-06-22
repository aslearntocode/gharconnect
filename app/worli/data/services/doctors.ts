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
  }
  
  export const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Ameet Mandot",
      specialization: "The Gut Clinic",
      qualification: "MBBS, MD, DNB Gastroenterology",
      experience: "24 years",
      address: "Parel, Mumbai",
      phone: "+91 8451010330",
      timing: "Mon-Sat: 9 AM - 1 PM, 4 PM - 8 PM",
      society: "Parel",
      consultationFee: "Call for appointment",
      languages: ["English", "Hindi", "Marathi"]
    },
    {
      id: "2",
      name: "Dr. Cyrus Contractor",
      specialization: "Pediatrician",
      qualification: "MBBS, DCH",
      experience: "20 years",
      address: "Dadar, Mumbai",
      phone: "+91 2224149581 / 9820142430",
      timing: "Mon-Sat: 10 AM - 2 PM, 5 PM - 9 PM",
      society: "Dadar",
      consultationFee: "Call for appointment",
      languages: ["English", "Hindi", "Gujarati"]
    }
  ]; 