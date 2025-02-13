

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AddModel = require('./AddModel'); 

const router = express.Router();



// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDirectory = 'uploads/';
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = Date.now() + fileExtension; // Unique filename
        cb(null, fileName);
    },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
  fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/; // Allowed file types
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
      if (extname && mimetype) {
          return cb(null, true); // Accept the file
      } else {
          return cb(new Error('Only image and video files (JPEG, PNG, GIF, MP4, AVI, MOV) are allowed!'), false);
      }
  },
});



router.post('/add-property', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'photos', maxCount: 15 }]), async (req, res) => {
    try {
        console.log('Incoming request:', req.body, req.files);

        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }
        if (req.files['video'] && req.files['video'][0].size > 50 * 1024 * 1024) {
            return res.status(400).json({ message: 'Video file size exceeds 50MB.' });
        }

        const latestProperty = await AddModel.findOne().sort({ ppcId: -1 });
        const nextPpcId = latestProperty ? latestProperty.ppcId + 1 : 1001; // Start from 1001 if no records exist

        const newProperty = {
            ppcId: nextPpcId,
            phoneNumber: req.body.phoneNumber || null,
            propertyMode: req.body.propertyMode || null,
            propertyType: req.body.propertyType || null,
            price: req.body.price || null,
            propertyAge: req.body.propertyAge || null,
            bankLoan: req.body.bankLoan || null,
            negotiation: req.body.negotiation || null,
            length: req.body.length || null,
            breadth: req.body.breadth || null,
            totalArea: req.body.totalArea || null,
            ownership: req.body.ownership || null,
            bedrooms: req.body.bedrooms || null,
            kitchen: req.body.kitchen || null,
            kitchenType: req.body.kitchenType || null,
            balconies: req.body.balconies || null,
            floorNo: req.body.floorNo || null,
            areaUnit: req.body.areaUnit || null,
            propertyApproved: req.body.propertyApproved || null,
            postedBy: req.body.postedBy || null,
            facing: req.body.facing || null,
            salesMode: req.body.salesMode || null,
            salesType: req.body.salesType || null,
            description: req.body.description || null,
            furnished: req.body.furnished || null,
            lift: req.body.lift || null,
            attachedBathrooms: req.body.attachedBathrooms || null,
            western: req.body.western || null,
            numberOfFloors: req.body.numberOfFloors || null,
            carParking: req.body.carParking || null,
            rentalPropertyAddress: req.body.rentalPropertyAddress || null,
            country: req.body.country || null,
            state: req.body.state || null,
            city: req.body.city || null,
            district: req.body.district || null,
            area: req.body.area || null,
            streetName: req.body.streetName || null,
            doorNumber: req.body.doorNumber || null,
            nagar: req.body.nagar || null,
            ownerName: req.body.ownerName || null,
            email: req.body.email || null,
            bestTimeToCall: req.body.bestTimeToCall || null,
            alternatePhone:req.body.alternatePhone || null,
            countryCode:req.body.countryCode || null
        };

        if (req.files) {
            if (req.files['video']) newProperty.video = req.files['video'][0].path;
            if (req.files['photos']) newProperty.photos = req.files['photos'].map(file => file.path);
        }

        const isComplete = Object.values(newProperty).every(field => field !== null && field !== '') &&
            req.files['photos'] && req.files['video'];

        newProperty.status = isComplete ? 'complete' : 'incomplete';

        const savedProperty = await AddModel.create(newProperty);
        console.log('Property added successfully:', savedProperty);
        res.status(201).json({ message: 'Property added successfully!', newProperty: savedProperty });
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ message: 'Error adding property.', error });
    }
});


router.post('/update-properties', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'photos', maxCount: 15 }]), async (req, res) => {
    // Check for multer errors
    if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
    }
    if (req.files['video'] && req.files['video'][0].size > 50 * 1024 * 1024) {
        return res.status(400).json({ message: 'Video file size exceeds 50MB.' });
    }

    const {
        ppcId,
        phoneNumber,
        propertyMode,
        propertyType,
        price, 
    propertyAge,
    bankLoan,
    negotiation,
    length,
    breadth,
    totalArea,
    ownership,
    bedrooms,
    kitchen,
    kitchenType,
    balconies,
    floorNo,
    areaUnit,
    propertyApproved,
    postedBy,
    facing,
    salesMode,
    salesType,
    description,
    furnished,
    lift,
    attachedBathrooms,
    western,
    numberOfFloors,
    carParking,
    rentalPropertyAddress,
    country,
    state,
    city,
    district,
    area,
    streetName,
    doorNumber,
    nagar,
    ownerName,
    email,
    countryCode,
    alternatePhone,
    bestTimeToCall
    } = req.body;




    if (!ppcId || !phoneNumber) {
        return res.status(400).json({ message: 'PPC-ID and phone number are required.' });
    }

    try {
        console.log('Incoming update request:', req.body);

        // Find the user by PPC-ID and phone number
        const user = await AddModel.findOne({ ppcId, phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the property details only if provided in the request
        if (propertyMode) user.propertyMode = propertyMode;
        if (propertyType) user.propertyType = propertyType;
        if (price) user.price = price;
        if (propertyAge) user.propertyAge = propertyAge;
        if (bankLoan) user.bankLoan = bankLoan;
        if (negotiation) user.negotiation = negotiation;
        if (length) user.length = length;
        if (breadth) user.breadth = breadth;
        if (totalArea) user.totalArea = totalArea;
        if (ownership) user.ownership = ownership;
        if (bedrooms) user.bedrooms = bedrooms;
        if (kitchen) user.kitchen = kitchen;
        if (kitchenType) user.kitchenType = kitchenType;
        if (balconies) user.balconies = balconies;
        if (floorNo) user.floorNo = floorNo;
        if (areaUnit) user.areaUnit = areaUnit;
        if (propertyApproved) user.propertyApproved = propertyApproved;
        if (postedBy) user.postedBy = postedBy;
        if (facing) user.facing = facing;
        if (salesMode) user.salesMode = salesMode;
        if (salesType) user.salesType = salesType;
        if (description) user.description = description;
        if (furnished) user.furnished = furnished;
        if (lift) user.lift = lift;
        if (attachedBathrooms) user.attachedBathrooms = attachedBathrooms;
        if (western) user.western = western;
        if (numberOfFloors) user.numberOfFloors = numberOfFloors;
        if (carParking) user.carParking = carParking;
        
        // Address fields
        if (rentalPropertyAddress) user.rentalPropertyAddress = rentalPropertyAddress;
        if (country) user.country = country;
        if (state) user.state = state;
        if (city) user.city = city;
        if (district) user.district = district;
        if (area) user.area = area;
        if (streetName) user.streetName = streetName;
        if (doorNumber) user.doorNumber = doorNumber;
        if (nagar) user.nagar = nagar;
        if (ownerName) user.ownerName = ownerName;
        if (email) user.email = email;
        if (bestTimeToCall) user.bestTimeToCall = bestTimeToCall;
        if(alternatePhone) user.alternatePhone = alternatePhone;
        if(countryCode) user.countryCode =countryCode;

        // Handle video and photo updates
        if (req.files) {
            if (req.files['video']) {
                user.video = req.files['video'][0].path; // Save video path
            }

            if (req.files['photos']) {
                user.photos = req.files['photos'].map(file => file.path); // Save photo paths
            }
        }

        // Check if all required fields are filled
        const isComplete = [
            propertyMode, propertyType, price, propertyAge,
            bankLoan,
            negotiation,
            length,
            breadth,
            totalArea,
            ownership,
            bedrooms,
            kitchen,
            kitchenType, balconies, floorNo,
            areaUnit, propertyApproved, postedBy, facing, salesMode, salesType,
            description, furnished, lift, attachedBathrooms, western, numberOfFloors,
            carParking, rentalPropertyAddress, country, state, city, district,
            area, streetName, doorNumber, nagar, ownerName, email,alternatePhone,countryCode, bestTimeToCall,
            req.files['photos'], req.files['video'] // Ensure photos and video are present
        ].every(field => field !== undefined && field !== '' && (Array.isArray(field) ? field.length > 0 : true));

        // Set status based on whether all required fields are filled
        user.status = isComplete ? 'complete' : 'incomplete';

        // Save updated user data
        await user.save();

        console.log('Property details updated successfully:', user);
        res.status(200).json({ message: 'Property details updated successfully!', user });
    } catch (error) {
        console.error('Error updating property details:', error);
        res.status(500).json({ message: 'Error updating property details.', error });
    }
});






router.get('/fetch-data', async (req, res) => {
    const { phoneNumber, ppcId } = req.query;

    // Ensure at least one parameter is provided
    if (!phoneNumber && !ppcId) {
        return res.status(400).json({ message: 'Either phone number or PPC-ID is required.' });
    }

    try {
        console.log('Incoming fetch request:', req.query);

        // Normalize phone number (remove spaces, dashes, country code, and ensure consistency)
        const normalizedPhoneNumber = phoneNumber
            ? phoneNumber.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '').trim() // Remove country code, spaces, dashes
            : null;

        // Build query dynamically based on the provided parameters
        const query = {};
        if (normalizedPhoneNumber) query.phoneNumber = new RegExp(normalizedPhoneNumber + '$'); // Match phone number ending with the query
        if (ppcId) query.ppcId = ppcId;

        console.log('Query Object:', query);

        // Fetch user from the database
        const user = await AddModel.findOne(query);

        // Check if user exists
        if (!user) {
            console.error('User not found:', query);
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User data fetched successfully!', user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details.', error });
    }
});






// router.get('/latest-ppcid', async (req, res) => {
//     try {
//         const latestProperty = await AddModel.findOne().sort({ ppcId: -1 });
//         res.json({ latestPpcId: latestProperty ? latestProperty.ppcId : null });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching latest ppcId', error });
//     }
// });



// Get the latest ppcId and increment it by 1
router.get('/latest-ppcid', async (req, res) => {
    try {
        // Find the latest property entry sorted by ppcId in descending order
        const latestProperty = await AddModel.findOne().sort({ ppcId: -1 });

        // If no property found, set the initial ppcId as 1001 (or your choice of starting point)
        const nextPpcId = latestProperty ? latestProperty.ppcId + 1 : 1001;

        // Send the next ppcId as the response
        res.json({ latestPpcId: nextPpcId });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching latest ppcId', error });
    }
});



module.exports = router;



