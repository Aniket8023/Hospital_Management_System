export const INITIAL_DEPARTMENTS = [
  "ENT",
  "Pediatric ENT",
  "Head & Neck Surgery",
  "Allergy & Sleep Apnea"
];

export const INITIAL_SERVICES = [
  {
    id: "ear-care",
    title: "Ear Care",
    description: "Treatment for ear infections, hearing loss, ear discharge, tinnitus and more.",
    icon: "耳"
  },
  {
    id: "nose-care",
    title: "Nose Care",
    description: "Sinusitis, nasal blockage, allergy, deviated septum and nasal polyps treatment.",
    icon: "👃"
  },
  {
    id: "throat-care",
    title: "Throat Care",
    description: "Tonsillitis, sore throat, voice disorders and throat infections.",
    icon: "🗣️"
  },
  {
    id: "head-neck",
    title: "Head & Neck",
    description: "Tumors, thyroid surgeries, salivary gland disorders and more.",
    icon: "👤"
  },
  {
    id: "endoscopic-ent",
    title: "Endoscopic ENT Surgeries",
    description: "Minimally invasive endoscopic procedures for faster recovery and better outcomes.",
    icon: "🔬"
  },
  {
    id: "allergy-treatment",
    title: "Allergy Treatment",
    description: "Diagnosis and treatment for allergies, asthma, and respiratory issues.",
    icon: "🧬"
  },
  {
    id: "voice-speech",
    title: "Voice & Speech Therapy",
    description: "Therapy for voice disorders, speech problems and communication difficulties.",
    icon: "💬"
  },
  {
    id: "pediatric-ent",
    title: "Pediatric ENT Care",
    description: "Specialized ENT care for children including infections and breathing issues.",
    icon: "👶"
  },
  {
    id: "hearing-tests",
    title: "Hearing Tests & Hearing Aid Fitting",
    description: "Comprehensive hearing evaluation and hearing aid consultation.",
    icon: "🦻"
  },
  {
    id: "thyroid-neck",
    title: "Thyroid & Neck Disorders",
    description: "Evaluation and treatment of thyroid and other neck related conditions.",
    icon: "🦋"
  },
  {
    id: "sleep-apnea",
    title: "Sleep Apnea Management",
    description: "Diagnosis and treatment for sleep apnea and snoring related issues.",
    icon: "💤"
  },
  {
    id: "emergency-ent",
    title: "Emergency ENT Care",
    description: "24x7 emergency care for ENT injuries, infections and critical conditions.",
    icon: "🚑"
  }
];

export const INITIAL_DOCTORS = [
  {
    id: 1,
    name: "Dr. Rajendra Shinde",
    role: "Founder & Managing Director / Chief ENT Specialist",
    specialty: "Thyroid & Neck Disorders, Allergy Treatment",
    email: "rajendra.shinde@shindehospital.com",
    rating: 4.8,
    reviews: 86,
    phone: "8888551743",
    timeSlots: ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM"],
    department: "ENT",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    id: 2,
    name: "Dr. Amit Patil",
    role: "Senior Ear Specialist (Otologist)",
    specialty: "Ear Care, Hearing Tests & Hearing Aid Fitting",
    email: "amit.patil@shindehospital.com",
    rating: 4.9,
    reviews: 54,
    phone: "8888551743",
    timeSlots: ["10:00 AM - 12:00 PM", "02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"],
    department: "ENT",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    id: 3,
    name: "Dr. Snehal Deshmukh",
    role: "Pediatric ENT Specialist",
    specialty: "Nose Care, Pediatric ENT Care",
    email: "snehal.deshmukh@shindehospital.com",
    rating: 4.7,
    reviews: 42,
    phone: "7058094146",
    timeSlots: ["09:00 AM - 11:00 AM", "01:00 PM - 03:00 PM", "05:00 PM - 07:00 PM"],
    department: "Pediatric ENT",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    id: 4,
    name: "Dr. Vikram Joshi",
    role: "Head & Neck Surgeon",
    specialty: "Throat Care, Head & Neck, Sleep Apnea Management",
    email: "vikram.joshi@shindehospital.com",
    rating: 4.9,
    reviews: 67,
    phone: "7058094146",
    timeSlots: ["11:00 AM - 01:00 PM", "03:00 PM - 05:00 PM", "07:00 PM - 09:00 PM"],
    department: "Head & Neck Surgery",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300"
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "APT1001",
    patientName: "Aarav Sharma",
    mobileNumber: "9876543210",
    aadharNumber: "123456789012",
    emailAddress: "aarav.sharma@example.com",
    selectDoctor: "Dr. Rajendra Shinde",
    department: "ENT",
    preferredDate: "2026-06-15",
    preferredTime: "09:00 AM - 11:00 AM",
    reasonForVisit: "Persistent throat pain and difficulty swallowing.",
    status: "Pending",
    comments: "",
    prescription: ""
  },
  {
    id: "APT1002",
    patientName: "Priya Patel",
    mobileNumber: "9123456789",
    aadharNumber: "987654321098",
    emailAddress: "priya.patel@example.com",
    selectDoctor: "Dr. Snehal Deshmukh",
    department: "Pediatric ENT",
    preferredDate: "2026-06-16",
    preferredTime: "01:00 PM - 03:00 PM",
    reasonForVisit: "Ear pain and recurring fever in toddler child.",
    status: "Approved",
    comments: "Assigned to Dr. Snehal",
    prescription: ""
  },
  {
    id: "APT1003",
    patientName: "Rohan Mehta",
    mobileNumber: "9988776655",
    aadharNumber: "111122223333",
    emailAddress: "rohan.mehta@example.com",
    selectDoctor: "Dr. Vikram Joshi",
    department: "Head & Neck Surgery",
    preferredDate: "2026-06-14",
    preferredTime: "11:00 AM - 01:00 PM",
    reasonForVisit: "Thyroid follow up scan review.",
    status: "Completed",
    comments: "Thyroid scan is clean. Take medicine daily.",
    prescription: "Thyronorm 50mcg - 1 tab daily before breakfast"
  }
];
