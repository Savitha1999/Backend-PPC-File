const express = require('express');
const router = express.Router();
const Offer = require('./OfferModel');


// Route to create a new offer
router.post('/offer', async (req, res) => {
    try {
        const { price, phoneNumber, ppcId } = req.body;
        const newOffer = new Offer({ price, phoneNumber, ppcId });
        await newOffer.save();
        res.status(201).json({ message: 'Offer saved successfully', offer: newOffer });
    } catch (error) {
        res.status(500).json({ message: 'Error saving offer', error });
    }
});

// Route to get all offers
router.get('/get-offers', async (req, res) => {
    try {
        const offers = await Offer.find();
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching offers', error });
    }
});

module.exports = router;









