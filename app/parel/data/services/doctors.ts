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
    name: "Dr. Rajesh Kumar",
    specialization: "General Physician",
    qualification: "MBBS, MD",
    experience: "15 years",
    address: "123, Main Street, Near Society Gate",
    phone: "+91 98765 43210",
    timing: "Mon-Sat: 9 AM - 1 PM, 4 PM - 8 PM",
    society: "L&T Crescent Bay",
    consultationFee: "₹500",
    languages: ["English", "Hindi", "Marathi"]
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    qualification: "MBBS, DCH",
    experience: "12 years",
    address: "456, Health Street, Opp. Society Park",
    phone: "+91 98765 43211",
    timing: "Mon-Sat: 10 AM - 2 PM, 5 PM - 9 PM",
    society: "Ashok Gardens",
    consultationFee: "₹600",
    languages: ["English", "Hindi", "Gujarati"]
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    specialization: "Orthopedic Surgeon",
    qualification: "MBBS, MS (Ortho)",
    experience: "20 years",
    address: "789, Medical Complex, Near Society",
    phone: "+91 98765 43212",
    timing: "Mon-Fri: 11 AM - 3 PM, 6 PM - 9 PM",
    society: "Island City Centre",
    consultationFee: "₹800",
    languages: ["English", "Hindi", "Marathi"]
  },
  {
    id: "4",
    name: "Dr. Neha Gupta",
    specialization: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    experience: "8 years",
    address: "101, Health Plaza",
    phone: "+91 98765 43213",
    timing: "Mon-Sat: 9 AM - 2 PM",
    society: "Worli Sea Face",
    consultationFee: "₹1000",
    languages: ["English", "Hindi"]
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    specialization: "Cardiologist",
    qualification: "MBBS, DM (Cardiology)",
    experience: "18 years",
    address: "202, Medical Tower",
    phone: "+91 98765 43214",
    timing: "Mon-Fri: 10 AM - 4 PM",
    society: "Worli Koliwada",
    consultationFee: "₹1500",
    languages: ["English", "Hindi", "Marathi"]
  },
  {
    id: "6",
    name: "Dr. Meera Desai",
    specialization: "Gynecologist",
    qualification: "MBBS, DGO",
    experience: "14 years",
    address: "303, Health Complex",
    phone: "+91 98765 43215",
    timing: "Mon-Sat: 11 AM - 3 PM, 5 PM - 8 PM",
    society: "Worli Naka",
    consultationFee: "₹1200",
    languages: ["English", "Hindi", "Gujarati"]
  }
]; 