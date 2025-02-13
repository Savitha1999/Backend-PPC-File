






// PlanRouter.js
const express = require('express');
const Plan = require('../Plan/PlanModel')
const router = express.Router();


router.post('/store-plan', async (req, res) => {
    const { phoneNumber, name, packageType, unlimitedAds, price, durationDays, carsLimit, featuredAds, description } = req.body;

    // Ensure all required fields are provided
    // if (!phoneNumber || !name || !packageType || price === undefined || durationDays === undefined || featuredAds === undefined) {
    //     return res.status(400).json({ message: 'All required fields must be provided.' });
    // }

    try {
        // Log the incoming request body for debugging
        console.log('Received data:', req.body);

        // Create a new plan document
        const newPlan = new Plan({
            phoneNumber,
            name,
            packageType,
            unlimitedAds,
            price,
            durationDays,
            // carsLimit,
            featuredAds,
            description
        });

        // Save the plan to the database
        await newPlan.save();

        // Respond with a success message and the saved plan
        console.log('Plan added successfully:', newPlan);
        return res.status(201).json({ message: 'Plan added successfully!', newPlan });

    } catch (error) {
        console.error('Error storing plan details:', error);
        return res.status(500).json({ message: 'Error storing plan details.', error: error.message });
    }
});

module.exports = router;
