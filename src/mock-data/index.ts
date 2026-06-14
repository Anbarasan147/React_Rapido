import type { Location, Driver, RideCategory, UserProfile, Transaction, Notification, PromoOffer } from '../types';

// Central point: Indiranagar, Bengaluru
export const MAP_CENTER = { lat: 12.9716, lng: 77.6412 };

export const MOCK_LOCATIONS: Location[] = [
  { name: 'Indiranagar Metro Station', address: 'Binnamangala, Stage 1, Indiranagar, Bengaluru, Karnataka 560038', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala 5th Block', address: 'Near Jyoti Nivas College, Bengaluru, Karnataka 560095', lat: 12.9348, lng: 77.6189 },
  { name: 'Manyata Tech Park', address: 'Hebbal Outer Ring Rd, Nagawara, Bengaluru, Karnataka 560045', lat: 13.0452, lng: 77.6204 },
  { name: 'Kempegowda International Airport (BLR)', address: 'KIAL Rd, Devanahalli, Bengaluru, Karnataka 560300', lat: 13.1986, lng: 77.7066 },
  { name: 'Majestic Railway Station', address: 'Kempegowda, Sevashrama, Bengaluru, Karnataka 560023', lat: 12.9780, lng: 77.5724 },
  { name: 'HSR Layout Sector 6', address: 'Outer Ring Road, HSR Layout, Bengaluru, Karnataka 560102', lat: 12.9121, lng: 77.6444 },
  { name: 'UB City Mall', address: 'Vittal Mallya Rd, KG Halli, D\' Souza Layout, Ashok Nagar, Bengaluru, Karnataka 560001', lat: 12.9716, lng: 77.5959 },
  { name: 'Electronic City Phase 1', address: 'Hosur Rd, Electronic City, Bengaluru, Karnataka 560100', lat: 12.8448, lng: 77.6632 },
  { name: 'Phoenix Marketcity Mall', address: 'Whitefield Main Rd, Devasandra Industrial Estate, Bengaluru, Karnataka 560048', lat: 12.9958, lng: 77.6964 }
];

export const RIDE_CATEGORIES: RideCategory[] = [
  { id: 'bike', name: 'Bike Taxi', description: 'Beat the traffic, solo ride', baseFare: 19, perKmRate: 8, eta: 2, capacity: 1 },
  { id: 'auto', name: 'Auto', description: 'Comfortable & quick travel', baseFare: 35, perKmRate: 12, eta: 3, capacity: 3 },
  { id: 'cab', name: 'Cab', description: 'Pocket-friendly AC hatchbacks', baseFare: 69, perKmRate: 16, eta: 5, capacity: 4 },
  { id: 'parcel', name: 'Parcel', description: 'Instant package delivery', baseFare: 29, perKmRate: 9, eta: 4, capacity: 1 }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'drv_1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    tripsCount: 1420,
    vehicleType: 'bike',
    vehicleName: 'Hero Splendor Plus',
    vehicleNumber: 'KA-03-HA-4321',
    lat: 12.9735,
    lng: 77.6435,
    angle: 45
  },
  {
    id: 'drv_2',
    name: 'Manjunath Swamy',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    tripsCount: 3850,
    vehicleType: 'auto',
    vehicleName: 'Bajaj RE Auto',
    vehicleNumber: 'KA-51-B-8765',
    lat: 12.9705,
    lng: 77.6380,
    angle: 120
  },
  {
    id: 'drv_3',
    name: 'Amit Patel',
    phone: '+91 99000 11223',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 4.7,
    tripsCount: 890,
    vehicleType: 'cab',
    vehicleName: 'Maruti Suzuki WagonR',
    vehicleNumber: 'KA-01-MD-9876',
    lat: 12.9750,
    lng: 77.6450,
    angle: 270
  },
  {
    id: 'drv_4',
    name: 'Santosh Gowda',
    phone: '+91 97400 98765',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    rating: 4.6,
    tripsCount: 520,
    vehicleType: 'parcel',
    vehicleName: 'Honda Activa 6G',
    vehicleNumber: 'KA-04-JZ-1245',
    lat: 12.9680,
    lng: 77.6400,
    angle: 180
  },
  {
    id: 'drv_5',
    name: 'Vijay M.',
    phone: '+91 96543 21098',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    tripsCount: 2150,
    vehicleType: 'bike',
    vehicleName: 'TVS Apache RTR 160',
    vehicleNumber: 'KA-02-ER-9012',
    lat: 12.9698,
    lng: 77.6442,
    angle: 300
  },
  {
    id: 'drv_6',
    name: 'Syed Hussain',
    phone: '+91 95350 12345',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    rating: 4.75,
    tripsCount: 1100,
    vehicleType: 'auto',
    vehicleName: 'Ape Piaggio Auto',
    vehicleNumber: 'KA-03-C-5432',
    lat: 12.9740,
    lng: 77.6360,
    angle: 15
  }
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', type: 'cash', icon: '💵' },
  { id: 'wallet', name: 'Rapido Wallet (₹150.00)', type: 'wallet', icon: '👛' },
  { id: 'gpay', name: 'Google Pay', type: 'upi', icon: '🎯' },
  { id: 'paytm', name: 'Paytm', type: 'wallet', icon: '💰' },
  { id: 'card', name: 'Credit/Debit Card (.... 5489)', type: 'card', icon: '💳' }
];

export const PROMO_BANNERS = [
  { id: 'banner_1', title: '50% OFF', subtitle: 'First 3 Bike rides', code: 'BIKE50', color: 'from-yellow-400 to-amber-500' },
  { id: 'banner_2', title: 'Auto Ride', subtitle: 'No cancellation charges', code: 'AUTOZERO', color: 'from-orange-500 to-red-500' },
  { id: 'banner_3', title: 'Send Packages', subtitle: 'Starting at just ₹19', code: 'PARCEL19', color: 'from-blue-500 to-indigo-600' },
  { id: 'banner_4', title: 'Refer & Earn', subtitle: 'Get ₹50 per friend referred', code: 'REFER50', color: 'from-emerald-500 to-teal-600' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif_1', title: 'Ride Completed!', body: 'You successfully completed a ride with Rajesh Kumar. Total fare charged: ₹48.', time: '2 hours ago', read: false, type: 'ride' },
  { id: 'notif_2', title: 'Exclusive offer: 30% OFF Auto Rides', body: 'Use code AUTOPASS for 30% discount on your next 5 auto rides.', time: '1 day ago', read: true, type: 'promo' },
  { id: 'notif_3', title: 'Security Alert', body: 'Your mobile number was verified on a new device. If it wasn\'t you, contact support.', time: '3 days ago', read: true, type: 'system' }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', amount: 48, type: 'debit', description: 'Paid for Ride ID: rap_948123', date: '13 Jun 2026, 04:12 PM' },
  { id: 'tx_2', amount: 200, type: 'credit', description: 'Added money to wallet via UPI', date: '12 Jun 2026, 11:20 AM' },
  { id: 'tx_3', amount: 35, type: 'debit', description: 'Paid for Ride ID: rap_943821', date: '10 Jun 2026, 08:35 AM' },
  { id: 'tx_4', amount: 50, type: 'credit', description: 'Referral bonus received', date: '08 Jun 2026, 06:15 PM' }
];

export const MOCK_OFFERS: PromoOffer[] = [
  { code: 'BIKE50', description: '50% off on your first 3 Bike rides', discount: 50, type: 'percentage', maxDiscount: 35 },
  { code: 'AUTOPASS', description: '30% off on Auto rides up to ₹25', discount: 30, type: 'percentage', maxDiscount: 25 },
  { code: 'RAPIDONE', description: 'Flat ₹20 off on bookings above ₹99', discount: 20, type: 'flat' }
];

export const INITIAL_USER: UserProfile = {
  name: 'Anbarasan V',
  phone: '+91 98765 01234',
  email: 'anbarasan.v@example.com',
  gender: 'male',
  savedAddresses: {
    home: MOCK_LOCATIONS[0], // Indiranagar Metro
    work: MOCK_LOCATIONS[2], // Manyata Tech Park
    others: [
      { id: 'addr_1', label: 'Gym', location: MOCK_LOCATIONS[6] } // UB City
    ]
  }
};
