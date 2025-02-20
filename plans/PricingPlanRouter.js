const express = require('express');
const router = express.Router();
const PricingPlans = require('../plans/PricingPlanModel');
const AddModel = require('../AddModel');


router.get('/get-plan', async (req, res) => {
    try {
        const plans = await PricingPlans.find();  // Retrieve all plans
        return res.status(200).json(plans);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching plans.', error: error.message });
    }
});

router.get('/get-all-plan', async (req, res) => {
    try {
        const plans = await PricingPlans.find(); // Fetch all plans

        // Filter unique plans based on 'name'
        const uniquePlans = [];
        const seenNames = new Set();

        plans.forEach(plan => {
            if (!seenNames.has(plan.name)) {
                seenNames.add(plan.name);
                uniquePlans.push(plan);
            }
        });

        return res.status(200).json(uniquePlans);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching plans.', error: error.message });
    }
});



router.post('/store-plan', async (req, res) => {
    const { name, packageType, unlimitedAds, price, durationDays, numOfCars, featuredAds, featuredMaxCar, description, status } = req.body;

    try {
        // Check if a plan with the same name already exists
        const existingPlan = await PricingPlans.findOne({ name });
        if (existingPlan) {
            return res.status(400).json({ message: 'Plan with this name already exists. Please use a different name.' });
        }

        const newPlan = new PricingPlans({
            name,
            packageType,
            unlimitedAds,
            price,
            durationDays,
            numOfCars,
            featuredAds,
            featuredMaxCar,
            description,
            status,
        });

        await newPlan.save();
        return res.status(201).json({ message: 'Plan added successfully!', newPlan });

    } catch (error) {
        return res.status(500).json({ message: 'Error storing plan details.', error: error.message });
    }
});





router.get('/plans', async (req, res) => {
    try {
        const plans = await PricingPlans.find(); // Fetch all plans

        // Filter unique plans based on 'name'
        const uniquePlans = [];
        const seenNames = new Set();

        plans.forEach(plan => {
            if (!seenNames.has(plan.name)) {
                seenNames.add(plan.name);
                uniquePlans.push(plan);
            }
        });

        return res.status(200).json(uniquePlans);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving plans.', error: error.message });
    }
});



// Get a specific plan by ID
router.get('/plans/:id', async (req, res) => {
    try {
        const plan = await PricingPlans.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found.' });
        }
        return res.status(200).json(plan);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving plan.', error: error.message });
    }
});


router.post('/register-plan', async (req, res) => {
    const { 
        name, 
        packageType, 
        unlimitedAds, 
        price, 
        durationDays, 
        numOfCars, 
        featuredAds, 
        featuredMaxCar, 
        description, 
        status, 
        phoneNumber  // Accept phoneNumber in the request body
    } = req.body;

    try {
        const userPlan = new PricingPlans({
            name,
            packageType,
            unlimitedAds,
            price,
            durationDays,
            numOfCars,
            featuredAds,
            featuredMaxCar,
            description,
            status,
            phoneNumber,  // Include phoneNumber in the plan data
        });

        await userPlan.save();
        console.log(userPlan)

        return res.status(201).json({ message: 'Plan added successfully!', userPlan });
    } catch (error) {
        return res.status(500).json({ message: 'Error storing plan details.', error: error.message });
    }
});




router.put('/update-plan-data/:id', async (req, res) => {
    const { name, packageType, unlimitedAds, price, durationDays, numOfCars, featuredAds, featuredMaxCar, description, status } = req.body;

    try {
        // Check if another plan already has this name
        const existingPlan = await PricingPlans.findOne({ name, _id: { $ne: req.params.id } });
        if (existingPlan) {
            return res.status(400).json({ message: 'Another plan with this name already exists. Choose a different name.' });
        }

        const updatedPlan = await PricingPlans.findByIdAndUpdate(
            req.params.id,
            { name, packageType, unlimitedAds, price, durationDays, numOfCars, featuredAds, featuredMaxCar, description, status },
            { new: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found.' });
        }

        return res.status(200).json({ message: 'Plan updated successfully!', updatedPlan });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating plan.', error: error.message });
    }
});


// Update a plan's status by ID
router.put('/update-plan/:id', async (req, res) => {
    const { status } = req.body;

    try {
        const updatedPlan = await PricingPlans.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found.' });
        }
        return res.status(200).json({ message: 'Plan status updated successfully!', updatedPlan });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating plan status.', error: error.message });
    }
});

// Delete a plan by ID
router.delete('/delete-plan/:id', async (req, res) => {
    try {
        const deletedPlan = await PricingPlans.findByIdAndDelete(req.params.id);
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan not found.' });
        }
        return res.status(200).json({ message: 'Plan deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting plan.', error: error.message });
    }
});

// Get all active plans
router.get('/active-plans', async (req, res) => {
    try {
        const activePlans = await PricingPlans.find({ status: 'active' });
        return res.status(200).json(activePlans);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving active plans.', error: error.message });
    }
});




router.get('/get-new-plan', async (req, res) => {
    const { phoneNumber } = req.query;
    console.log("Received phone number:", phoneNumber);

    try {
        // Fetch all plans for the given phoneNumber
        const plans = await PricingPlans.find({ phoneNumber: String(phoneNumber) }).exec();
        console.log("Found plans:", plans);  // Log all found plans
        
        if (!plans || plans.length === 0) {
            return res.status(404).json({ message: 'No plans found for this phone number' });
        }

        res.status(200).json({ plans }); // Return all plans
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Error fetching plan data', error: error.message });
    }
});



  router.get('/expiring-soon', async (req, res) => {
    try {
        const currentDate = new Date();
        const expiringDate = new Date();
        expiringDate.setDate(currentDate.getDate() + 5); // 5 days before expiry

        const expiringPlans = await PricingPlans.find({
            status: 'active',
            $expr: {
                $lte: [
                    { $add: ["$createdAt", { $multiply: ["$durationDays", 86400000] }] },
                    expiringDate
                ]
            }
        });

        return res.status(200).json(expiringPlans);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving expiring plans.', error: error.message });
    }
});


router.get('/expired-plans', async (req, res) => {
    try {
        const currentDate = new Date();

        const expiredPlans = await PricingPlans.find({
            status: 'active',
            $expr: {
                $lt: [
                    { $add: ["$createdAt", { $multiply: ["$durationDays", 86400000] }] },
                    currentDate
                ]
            }
        });

        return res.status(200).json(expiredPlans);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving expired plans.', error: error.message });
    }
});


router.put('/update-expired-plans', async (req, res) => {
    try {
        const currentDate = new Date();

        const updatedPlans = await PricingPlans.updateMany(
            {
                status: 'active',
                $expr: {
                    $lt: [
                        { $add: ["$createdAt", { $multiply: ["$durationDays", 86400000] }] },
                        currentDate
                    ]
                }
            },
            { $set: { status: 'expired' } }
        );

        return res.status(200).json({ message: 'Expired plans updated successfully!', updatedPlans });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating expired plans.', error: error.message });
    }
});




module.exports = router;
