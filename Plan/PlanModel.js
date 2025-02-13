



const mongoose = require('mongoose');

// Define the plan schema
const planSchema = new mongoose.Schema({
    // Phone number is unique and required for each plan
    phoneNumber: { 
        type: String, 
        required: true, 
       
    },

    // Plan name, required with enum validation
    name: { 
        type: String, 
        required: true, 
        enum: ['SILVER', 'SILVER PLUS', 'GOLD', 'PLATINUM', 'TENANT PLATINUM', 'TENANT GOLD'],
        trim: true,
    },

    // Package type (for example, 'Dealers Package')
    packageType: { 
        type: String, 
        required: true, 
        enum: ['Dealers Package'],
        trim: true,
    },

    // Boolean to determine if the plan includes unlimited ads
    unlimitedAds: { 
        type: Boolean, 
        default: false 
    },

    // Price of the plan, constrained to specific values
    price: { 
        type: Number, 
        enum: [299, 499, 999, 1499, 2000, 1000],
    },

    // Duration in days (valid durations defined in the enum)
    durationDays: { 
        type: Number, 
        enum: [30, 60, 90, 180],
    },

    // Number of cars allowed with the plan
    // carsLimit: { 
    //     type: Number, 
    //     enum: [1, 5, 10, 20], 
    // },

    // Number of featured ads included in the plan
    featuredAds: { 
        type: Number, 
        enum: [0, 1, 5, 20], 
    },

    // Description of the plan
    description: { 
        type: String, 
        trim: true,
    },
});

// Create the model from the schema
const Plan = mongoose.model('Plan', planSchema);

// Export the model for use in other parts of the application
module.exports = Plan;
