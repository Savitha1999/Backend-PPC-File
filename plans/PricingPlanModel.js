const mongoose = require('mongoose');

// Define the plan schema
const PricingPlanSchema = new mongoose.Schema({
    // Phone number is unique and required for each plan
    phoneNumber: { 
        type: Number, 
    },

    // Plan name, required with enum validation
    name: { 
        type: String, 
        required: true, 
        unique: true,
        },

    // Package type (for example, 'Dealers Package')
    packageType: { 
        type: String, 
        required: true, 
    },

    // Boolean to determine if the plan includes unlimited ads
    unlimitedAds: { 
        type: Boolean, 
        default: false 
    },

    // Price of the plan, constrained to specific values
    price: { 
        type: Number, 
    },

    // Duration in days (valid durations defined in the enum)
    durationDays: { 
        type: Number, 
    },

    // Number of featured ads included in the plan
    featuredAds: { 
        type: Number, 
    },

    // Description of the plan
    description: { 
        type: String, 
        trim: true,
    },

    // Status of the plan
    status: {
        type: String,
        enum: ['active', 'hide'],
        default: 'active'
    },

    // Number of cars (new field)
    numOfCars: {
        type: Number,
    },

    // Featured max car (new field)
    featuredMaxCar: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const PricingPlans = mongoose.model('PricingPlans', PricingPlanSchema);

module.exports = PricingPlans;



