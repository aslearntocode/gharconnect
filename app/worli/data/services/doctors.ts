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
      phone: "+91 84510 10330",
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
      phone: "+91 2224149581 / 98201 42430",
      timing: "Mon-Sat: 10 AM - 2 PM, 5 PM - 9 PM",
      society: "Dadar",
      consultationFee: "Call for appointment",
      languages: ["English", "Hindi", "Gujarati"]
    },
  {id: "3",
    name: "Sunanda D",
    specialization: "Nutrition",
    qualification: "M.S. (USA)",
    experience: "10+ years",
    address: "Online",
    phone: "+91 85911 54545",
    timing: "Mon-Sat",
    society: "Online",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"]
  },
  {
    id: "4",
    name: "Kashish Chimnani",
    specialization: "Nutrition",
    qualification: "M.S.",
    experience: "10+ years",
    address: "Online",
    phone: "+91 99206 95556",
    timing: "Mon-Sat",
    society: "Online",
    consultationFee: "Call for appointment",
    languages: ["English", "Hindi", "Marathi"]
  }
  ]; 