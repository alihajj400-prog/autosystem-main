// Business contact info - update these to change site-wide
export const BUSINESS = {
  name: 'Autosystem',
  tagline: 'Premium Used Mazda Vehicles in Lebanon',
  phone: '+961 03 750 078',
  whatsapp: '+96103750078',
  email: 'info@autosystemsal.com',
  address: 'Zarif, Beirut, Lebanon',
  city: 'Beirut',
  country: 'Lebanon',
  mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.5!2d35.4975!3d33.8775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17274e256527%3A0xe87e8657836612081!2sAutosystem+SAL!5e0!3m2!1sen!2slb!4v1700000000000',
  hours: {
    weekday: 'Mon – Fri: 8:00 AM – 6:00 PM',
    saturday: 'Saturday: 9:00 AM – 5:00 PM',
    sunday: 'Sunday: Closed',
  },
  social: {
    instagram: 'https://instagram.com/autosystem.lb',
    facebook: 'https://facebook.com/autosystem.lb',
    whatsappLink: 'https://wa.me/96103750078',
  },
} as const;

export const MAZDA_MODELS = [
  'Mazda3',
  'Mazda6',
  'CX-3',
  'CX-5',
  'CX-9',
  'CX-30',
  'MX-5',
  'CX-50',
  'CX-70',
  'CX-90',
  'MX-30',
];

export const YEARS = Array.from({ length: 20 }, (_, i) => 2025 - i);

export const PART_CATEGORIES = [
  'Engine & Performance',
  'Brakes & Suspension',
  'Body & Exterior',
  'Interior & Trim',
  'Electronics',
  'Infotainment Screens',
  'Head Units & Displays',
  'Lighting',
  'Wheels & Tires',
  'Maintenance',
  'Accessories',
];

export const LEBANESE_CITIES = [
  'Beirut',
  'Dbayeh',
  'Jounieh',
  'Byblos',
  'Tripoli',
  'Sidon',
  'Zahle',
  'Batroun',
];
