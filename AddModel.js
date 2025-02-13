

const mongoose = require('mongoose');

// List of country codes (you can extend this as needed)
const countryCodes = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+34', country: 'Spain' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+86', country: 'China' },
  { code: '+39', country: 'Italy' },
  { code: '+7', country: 'Russia/Kazakhstan' },
  { code: '+82', country: 'South Korea' },
  { code: '+46', country: 'Sweden' },
  { code: '+31', country: 'Netherlands' },
  { code: '+41', country: 'Switzerland' },
  { code: '+32', country: 'Belgium' },
  { code: '+47', country: 'Norway' },
  { code: '+358', country: 'Finland' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+48', country: 'Poland' },
  { code: '+30', country: 'Greece' },
  { code: '+351', country: 'Portugal' },
  { code: '+20', country: 'Egypt' },
  { code: '+27', country: 'South Africa' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+971', country: 'UAE' },
  { code: '+90', country: 'Turkey' },
  { code: '+62', country: 'Indonesia' },
  { code: '+63', country: 'Philippines' },
  { code: '+64', country: 'New Zealand' },
  { code: '+856', country: 'Laos' },
  { code: '+66', country: 'Thailand' },
  { code: '+84', country: 'Vietnam' },
  { code: '+92', country: 'Pakistan' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+972', country: 'Israel' },
  { code: '+56', country: 'Chile' },
  { code: '+54', country: 'Argentina' },
  { code: '+595', country: 'Paraguay' },
  { code: '+57', country: 'Colombia' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+503', country: 'El Salvador' },
  { code: '+509', country: 'Haiti' },
  { code: '+213', country: 'Algeria' },
  { code: '+216', country: 'Tunisia' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+234', country: 'Nigeria' },
  { code: '+254', country: 'Kenya' },
  { code: '+255', country: 'Tanzania' },
  { code: '+256', country: 'Uganda' },
  { code: '+591', country: 'Bolivia' },
  { code: '+593', country: 'Ecuador' },
  { code: '+375', country: 'Belarus' },
  { code: '+373', country: 'Moldova' },
  { code: '+380', country: 'Ukraine' }
];


const alternateCountryCode =[
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+34', country: 'Spain' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+86', country: 'China' },
  { code: '+39', country: 'Italy' },
  { code: '+7', country: 'Russia/Kazakhstan' },
  { code: '+82', country: 'South Korea' },
  { code: '+46', country: 'Sweden' },
  { code: '+31', country: 'Netherlands' },
  { code: '+41', country: 'Switzerland' },
  { code: '+32', country: 'Belgium' },
  { code: '+47', country: 'Norway' },
  { code: '+358', country: 'Finland' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+48', country: 'Poland' },
  { code: '+30', country: 'Greece' },
  { code: '+351', country: 'Portugal' },
  { code: '+20', country: 'Egypt' },
  { code: '+27', country: 'South Africa' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+971', country: 'UAE' },
  { code: '+90', country: 'Turkey' },
  { code: '+62', country: 'Indonesia' },
  { code: '+63', country: 'Philippines' },
  { code: '+64', country: 'New Zealand' },
  { code: '+856', country: 'Laos' },
  { code: '+66', country: 'Thailand' },
  { code: '+84', country: 'Vietnam' },
  { code: '+92', country: 'Pakistan' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+972', country: 'Israel' },
  { code: '+56', country: 'Chile' },
  { code: '+54', country: 'Argentina' },
  { code: '+595', country: 'Paraguay' },
  { code: '+57', country: 'Colombia' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+503', country: 'El Salvador' },
  { code: '+509', country: 'Haiti' },
  { code: '+213', country: 'Algeria' },
  { code: '+216', country: 'Tunisia' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+234', country: 'Nigeria' },
  { code: '+254', country: 'Kenya' },
  { code: '+255', country: 'Tanzania' },
  { code: '+256', country: 'Uganda' },
  { code: '+591', country: 'Bolivia' },
  { code: '+593', country: 'Ecuador' },
  { code: '+375', country: 'Belarus' },
  { code: '+373', country: 'Moldova' },
  { code: '+380', country: 'Ukraine' }
]

const locationData = {
  "Tamil Nadu": {
    "Chennai": ["T. Nagar", "Adyar", "Velachery"],
    "Coimbatore": ["Gandhipuram", "RS Puram", "Peelamedu"],
    "Madurai": ["Anna Nagar", "KK Nagar", "Simmakkal"],
  },
  "Karnataka": {
    "Bangalore": ["Whitefield", "Electronic City", "Jayanagar"],
    "Mysore": ["Vijayanagar", "Hebbal", "Lakshmipuram"],
  },
  "Maharashtra": {
    "Mumbai": ["Andheri", "Borivali", "Dadar"],
    "Pune": ["Shivaji Nagar", "Hinjewadi", "Kothrud"],
  },
};

// Extract states, districts, and areas dynamically
const states = Object.keys(locationData);
const allDistricts = states.flatMap((state) => Object.keys(locationData[state]));
const allAreas = allDistricts.flatMap((district) =>
  Object.values(locationData).flatMap((state) => state[district] || [])
);

const AddSchema = new mongoose.Schema({
  phoneNumber: { type: String,  index: true },
  ppcId: { type: Number, unique: true },

  views: { type: Number, default: 0 },

  countryCode: {
    type: String,
    required: true,
    default: '+91',
  },
  alternateCountryCode: {
    type: String,
    // required: true,
    default: '+91',
  },

  propertyMode: { type: String },

  propertyType: { type: String },

  propertyAge: { type: String },

  // price: { type: Number   },

    price: { type: Number, default: 0 },

  
  status: {
    type: String,
    enum: ['incomplete','active','pending', 'complete', 'delete','undo', 'sendInterest', 'soldOut', 'reportProperties', 'needHelp','contact', 'favorite','alreadySaved', 'favoriteRemoved'],
    default: 'incomplete',
  },
  
  favoriteRequests: [{ phoneNumber: { type: String } }],


  previousStatus: { type: String, enum: ['incomplete', 'complete'] }, 



  interestRequests: [
    { phoneNumber: { type: String }, date: { type: Date } }
  ],

  helpRequests: [{ phoneNumber: { type: String } }],
  soldOutReport: [{ phoneNumber: { type: String } }],
  reportProperty: [{ phoneNumber: { type: String } }],
  contactRequests: [{ phoneNumber: { type: String } }],
  alreadySaved: [{ phoneNumber: { type: String } }],
  favoriteRemoved: [{ phoneNumber: { type: String } }],

  bankLoan: { type: String },
  negotiation: { type: String },

  length: { type: Number },
  breadth: { type: Number },
  totalArea: { type: Number },

  ownership: { type: String },

  bedrooms: { type: String },

  kitchen: { type: String },
  kitchenType: { type: String },

  balconies: { type: String },

  floorNo: { type: String },

  areaUnit: { type: String },

  propertyApproved: { type: String },
  postedBy: { type: String },

  facing: { type: String },

  salesMode: { type: String },
  salesType: { type: String },
  description: { type: String },

  furnished: { type: String },
  lift: { type: String },

  attachedBathrooms: { type: String },

  western: { type: String },

  numberOfFloors: { type: String },

  carParking: { type: String },

  rentalPropertyAddress: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  district: { type: String },
  area: { type: String },
  streetName: { type: String },
  doorNumber: { type: String },
  nagar: { type: String },
  ownerName: { type: String },
  email: { type: String },

  bestTimeToCall: { type: String },

  video: { type: String },

  photos: {
    type: [String],
    default: [],
  },

  // state: {
  //   type: String,
  //   required: true,
  //   enum: states, // Ensures only predefined states are allowed
  // },
  // district: {
  //   type: String,
  //   required: true,
  //   validate: {
  //     validator: function (value) {
  //       return allDistricts.includes(value); // Checks if the district exists
  //     },
  //     message: "Invalid district selected",
  //   },
  // },
  // area: {
  //   type: String,
  //   required: true,
  //   validate: {
  //     validator: function (value) {
  //       return allAreas.includes(value); // Checks if the area exists
  //     },
  //   }
  // },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reason: { type: String, default: null, trim: true },

  isDeleted: { type: Boolean, default: false },
  deletionReason: { type: String, default: null, trim: true },
  deletionDate: { type: Date, default: null },

  alternatePhone: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AddModel', AddSchema);
