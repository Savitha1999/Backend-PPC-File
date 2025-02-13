const express = require('express');
const AddModel = require('../AddModel');

const router = express.Router();



// -------------------- Detailes Page Image Click Api ---------------








// **************  Interest ***********



  

router.post("/send-interests", async (req, res) => {
    const { phoneNumber, ppcId } = req.body;

    try {
        // Find the property by ppcId
        const property = await AddModel.findOne({ ppcId });

        // Check if the property exists
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Check if the user has already shown interest in this property
        const isAlreadyInterested = property.interestRequests.some(
            (request) => request.phoneNumber === phoneNumber
        );

        if (isAlreadyInterested) {
            return res.status(400).json({
                message: "You have already shown interest in this property.",
                status: "alreadySaved",
                alreadySaved: property.interestRequests.map((request) => request.phoneNumber), // Include already saved numbers
            });
        }

        // Add the phoneNumber to the interestRequests array
        await AddModel.updateOne(
            { ppcId },
            {
                $push: { interestRequests: { phoneNumber } },
                // $inc: { views: 1 }, // Increment the views count
                $set: { updatedAt: Date.now() } // Ensure updatedAt is set to the current time
            }
        );

        // Send success response
        return res.status(200).json({
            message: "Your interest has been recorded!",
            status: "sendInterest",
            postedUserPhoneNumber: property.phoneNumber,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            price: property.price,
            area: property.area,
            ownerName: property.ownerName,
            alreadySaved: property.interestRequests.map((request) => request.phoneNumber), // Include updated saved numbers
            views: property.views, // Return the updated views count
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


router.get('/get-interest-owner', async (req, res) => {
    try {
        const { phoneNumber } = req.query;  // Extract phoneNumber from query parameters
        
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required.' });
        }

        // Fetch properties where the phone number is included in the interestRequests
        const propertiesWithInterestRequests = await AddModel.find({
            'interestRequests.phoneNumber': phoneNumber
        });

        if (propertiesWithInterestRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found for this phone number.' });
        }

        // Map through the properties to get the relevant data
        const interestRequestsData = propertiesWithInterestRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            interestedUserPhoneNumbers: property.interestRequests ? 
                property.interestRequests.map(request => request.phoneNumber) : [],  // Collecting the phone numbers of users who showed interest
            propertyMode: property.propertyMode,          // Mode (Rent/Sale)
            propertyType: property.propertyType,          // Type (House, Apartment)
            price: property.price,                        // Price of the property
            area: property.area                           // Area of the property
        }));

        return res.status(200).json({ message: 'Interest requests fetched successfully', interestRequestsData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/get-interest-buyer', async (req, res) => {
    try {
        const { postedPhoneNumber } = req.query;  // Extract posted user's phone number (property owner) from query parameters
        
        // Validate phoneNumber exists
        if (!postedPhoneNumber) {
            return res.status(400).json({ message: 'Posted user phone number is required.' });
        }

        // Query the properties where the posted user (owner) has listed their property
        const propertiesByOwner = await AddModel.find({
            phoneNumber: postedPhoneNumber  // Match posted user (owner's) phone number
        });

        // If no properties are found with the given posted phone number
        if (propertiesByOwner.length === 0) {
            return res.status(404).json({ message: 'No properties found for this owner.' });
        }

        // Map through the found properties and return details with all the buyer's phone numbers who showed interest
        const propertiesData = propertiesByOwner.map(property => ({
            ppcId: property.ppcId,  // Property ID
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            propertyDetails: property.propertyDetails,  // Property details (if any)
            interestedUsers: property.interestRequests.map(request => request.phoneNumber)  // All buyers' phone numbers showing interest
        }));

        // Send response with the properties and their interest details
        return res.status(200).json({ message: 'Properties by the posted user', propertiesData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




router.get('/get-all-sendinterest', async (req, res) => {
    try {
        // Fetch all properties where interest requests exist
        const interestedProperties = await AddModel.find({ interestRequests: { $exists: true, $ne: [] } });

        // If no interested properties are found
        if (interestedProperties.length === 0) {
            return res.status(404).json({ message: 'No interest requests found.' });
        }

        // Extracting interest request details
        const interestRequestsData = interestedProperties.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            interestedUserPhoneNumbers: property.interestRequests.map(request => request.phoneNumber),
            propertyMode: property.propertyMode, // Rent/Sale
            propertyType: property.propertyType, // House/Apartment
            price: property.price, // Property price
            area: property.area,
            ownerName: property.ownerName || 'Unknown', // Fallback if owner name is missing
            views: property.views || 0, // Default views to 0 if missing
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        const propertiesData = interestedProperties.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            propertyDetails: property.propertyDetails || 'No details available', // Fallback value
            interestedUsers: property.interestRequests.map(request => request.phoneNumber),
            views: property.views || 0,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        return res.status(200).json({
            message: 'Interest request data fetched successfully',
            interestRequestsData,
            propertiesData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// Delete property by PPC ID
router.delete('/delete-interest/:ppcId', async (req, res) => {
    try {
        const { ppcId } = req.params;  // Extract PPC ID from URL params

        // Find and delete the property with the given PPC ID
        const deletedProperty = await AddModel.findOneAndDelete({ ppcId });

        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        return res.status(200).json({ message: 'Property deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/get-all-owners-and-buyers', async (req, res) => {
    try {
        // Fetch all properties from the database
        const allProperties = await AddModel.find({});

        // If no properties are found
        if (allProperties.length === 0) {
            return res.status(404).json({ message: 'No properties found.' });
        }

        // Extract owners' and buyers' data separately
        const owners = allProperties.map(property => ({
            ppcId: property.ppcId,
            ownerPhoneNumber: property.phoneNumber,  // Property owner's phone number
            propertyMode: property.propertyMode,  // Rent/Sale
            propertyType: property.propertyType,  // House, Apartment, etc.
            price: property.price,  // Property price
            area: property.area,  // Property area
            propertyDetails: property.propertyDetails  // Additional property details
        }));

        const buyers = [];

        allProperties.forEach(property => {
            if (property.interestRequests && property.interestRequests.length > 0) {
                property.interestRequests.forEach(request => {
                    buyers.push({
                        interestedUserPhoneNumber: request.phoneNumber,
                        interestedInPpcId: property.ppcId,
                        interestedInOwnerPhoneNumber: property.phoneNumber,
                        propertyMode: property.propertyMode,
                        propertyType: property.propertyType,
                        price: property.price,
                        views: property.views || 0,  // Default to 0 if undefined
                        createdAt: property.createdAt,
                        updatedAt: property.updatedAt
                    });
                });
            }
        });

        return res.status(200).json({ message: 'Owners and Buyers fetched successfully', owners, buyers });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




// ******* Need Help ********


router.post('/need-help', async (req, res) => {
    const { phoneNumber, ppcId } = req.body;

    try {
        const property = await AddModel.findOne({ ppcId });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const isAlreadyInterested = property.helpRequests.some(
            (request) => request.phoneNumber === phoneNumber
          );
      
          if (isAlreadyInterested) {
            return res.status(400).json({
              message: "You have already shown Need Help in this property.",
              status: "alreadySaved",
              alreadySaved: property.helpRequests.map((request) => request.phoneNumber), // Include already saved numbers

            });
          }

        // Add the phone number to the helpRequests array
        await AddModel.updateOne(
            { ppcId },
            { $push: { helpRequests: { phoneNumber } } ,
                // $inc: { views: 1 }, 
                $set: { updatedAt: Date.now() }
         } 
        );

        return res.status(200).json({
            message: 'Your help request has been recorded!',
            status: 'needHelp',
            postedUserPhoneNumber: property.phoneNumber,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            price: property.price,
            area: property.area,
            ownerName: property.ownerName,
            views: property.views, // Return the updated views count


        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.get('/get-help-as-buyer', async (req, res) => {
    const { postedPhoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!postedPhoneNumber) {
        return res.status(400).json({ message: 'Posted user phone number is required.' });
    }


    try {
        // Fetch properties where the buyer has made a helpRequest
        const propertiesWithBuyerHelpRequests = await AddModel.find({
            phoneNumber: postedPhoneNumber  // Match posted user (owner's) phone number
        });

        if (propertiesWithBuyerHelpRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found for this buyer help request.' });
        }

        // Map properties to include details about the help requests
        const helpRequestsData = propertiesWithBuyerHelpRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Owner's phone number
            propertyDetails: property.propertyDetails,  
            helpRequestersPhoneNumbers: property.helpRequests.map(req => req.phoneNumber) // All interested users
        }));

        return res.status(200).json({
            message: 'Properties with help requests fetched successfully.',
            helpRequestsData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




router.get('/get-help-as-owner', async (req, res) => {
    const { phoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required.' });
    }

    try {
        // Fetch properties where the phone number is included in the helpRequests
        const propertiesWithHelpRequests = await AddModel.find({
            'helpRequests.phoneNumber': phoneNumber
        });

        if (propertiesWithHelpRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found with help requests for this phone number.' });
        }

        const helpRequestsData = propertiesWithHelpRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            helpRequestedUserPhoneNumbers: property.helpRequests ? 
                property.helpRequests.map(request => request.phoneNumber) : [],  
            propertyMode: property.propertyMode,          // Mode (Rent/Sale)
            propertyType: property.propertyType,          // Type (House, Apartment)
            price: property.price,                        // Price of the property
            area: property.area                           // Area of the property
        }));

        return res.status(200).json({ message: 'Help requests fetched successfully', helpRequestsData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.get('/get-all-help-requests', async (req, res) => {
    try {
        // Fetch all properties where help requests exist
        const propertiesWithHelpRequests = await AddModel.find({ helpRequests: { $exists: true, $ne: [] } });

        // If no help request properties are found
        if (propertiesWithHelpRequests.length === 0) {
            return res.status(404).json({ message: 'No help requests found.' });
        }

        // Extracting help request details for owners
        const helpRequestsData = propertiesWithHelpRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            helpRequestedUserPhoneNumbers: property.helpRequests.map(request => request.phoneNumber),
            propertyMode: property.propertyMode, // Rent/Sale
            propertyType: property.propertyType, // House/Apartment
            price: property.price, // Property price
            area: property.area,
            ownerName: property.ownerName || 'Unknown', // Fallback if owner name is missing
            views: property.views || 0, // Default views to 0 if missing
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        // Extracting help request details for buyers
        const propertiesData = propertiesWithHelpRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            propertyDetails: property.propertyDetails || 'No details available', // Fallback value
            helpRequesters: property.helpRequests.map(request => request.phoneNumber),
            views: property.views || 0,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        return res.status(200).json({
            message: 'Help request data fetched successfully',
            helpRequestsData,
            propertiesData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



// Delete a help request for a specific property (ppcId)
router.delete('/delete-help/:ppcId', async (req, res) => {
    try {
        const { ppcId } = req.params;  // Extract PPC ID from URL params

        // Update the property by pulling out the helpRequests entry
        const updatedProperty = await AddModel.findOneAndUpdate(
            { ppcId },
            { $pull: { helpRequests: { phoneNumber: { $exists: true } } } },
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found or no help request to delete.' });
        }

        return res.status(200).json({ message: 'Help request removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// ********* Contact ***********



router.post('/contact', async (req, res) => {
    const { phoneNumber, ppcId } = req.body;

    try {
        // Find the property by its ppcId
        const property = await AddModel.findOne({ ppcId });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const postedUserPhoneNumber = property.phoneNumber;
        const propertyMode = property.propertyMode; // Rent or Sale
        const propertyType = property.propertyType; // House, Apartment, etc.
        const price = property.price;
        const area = property.area;
        const email = property.email;
        const bestTimeToCall = property.bestTimeToCall;
        const ownerName = property.ownerName;

        if (!postedUserPhoneNumber) {
            return res.status(404).json({ message: 'Phone number not found for the property owner.' });
        }

        // Check if the user has already made a contact request
        const isAlreadyContacted = property.contactRequests.some(
            (request) => request.phoneNumber === phoneNumber
        );

        if (isAlreadyContacted) {
            return res.status(400).json({
                message: 'You have already requested contact for this property.',
                status: 'alreadyContacted',
                alreadyContactedNumbers: property.contactRequests.map((request) => request.phoneNumber),
            });
        }

        // Add the phone number to the contactRequests array
        await AddModel.updateOne(
            { ppcId },
            {
                $push: { contactRequests: { phoneNumber, createdAt: new Date() } },
                $set: { status: 'contact', updatedAt: new Date() },
                $inc: { views: 1 } // Increment views count
            }
        );

        return res.status(200).json({
            message: 'Your contact request has been recorded!',
            status: 'contact',
            postedUserPhoneNumber,
            email,
            propertyMode,
            propertyType,
            price,
            area,
            bestTimeToCall,
            ownerName,
            views: property.views + 1, // Updated views count
            createdAt: new Date(), // Time of contact request
            updatedAt: new Date() // Last updated time
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

  
  

router.get('/get-contact-buyer', async (req, res) => {
    const { postedPhoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!postedPhoneNumber) {
        return res.status(400).json({ message: 'Posted user phone number is required.' });
    }

    try {
        // Fetch properties where the buyer has made a helpRequest
        const propertiesWithBuyerContactRequests = await AddModel.find({
            phoneNumber: postedPhoneNumber  // Match posted user (owner's) phone number
        });

        if (propertiesWithBuyerContactRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found for this buyer help request.' });
        }

        // Map properties to include details about the help requests
        const contactRequestsData = propertiesWithBuyerContactRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Owner's phone number
            propertyDetails: property.propertyDetails,  
            contactRequestersPhoneNumbers: property.contactRequests.map(req => req.phoneNumber) // All interested users
        }));

        return res.status(200).json({
            message: 'Properties with help requests fetched successfully.',
            contactRequestsData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




router.get('/get-contact-owner', async (req, res) => {
    const { phoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required.' });
    }

    try {
        // Fetch properties where the phone number is included in the helpRequests
        const propertiesWithContactRequests = await AddModel.find({
            'contactRequests.phoneNumber': phoneNumber
        });

        if (propertiesWithContactRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found with help requests for this phone number.' });
        }

        const contactRequestsData = propertiesWithContactRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            contactRequestedUserPhoneNumbers: property.contactRequests ? 
            property.contactRequests.map(request => request.phoneNumber) : [],  
            propertyMode: property.propertyMode,          // Mode (Rent/Sale)
            propertyType: property.propertyType,          // Type (House, Apartment)
            price: property.price,                        // Price of the property
            area: property.area,
            bestTimeToCall: property.bestTimeToCall,
            email:property.email

        }));

        return res.status(200).json({ message: 'Help requests fetched successfully', contactRequestsData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.get('/get-all-contact-requests', async (req, res) => {
    try {
        // Fetch all properties where contact requests exist
        const propertiesWithContactRequests = await AddModel.find({ contactRequests: { $exists: true, $ne: [] } });

        // If no contact request properties are found
        if (propertiesWithContactRequests.length === 0) {
            return res.status(404).json({ message: 'No contact requests found.' });
        }

        // Extracting contact request details for owners
        const contactRequestsData = propertiesWithContactRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            contactRequestedUserPhoneNumbers: property.contactRequests.map(request => request.phoneNumber),
            propertyMode: property.propertyMode, // Rent/Sale
            propertyType: property.propertyType, // House/Apartment
            price: property.price, // Property price
            area: property.area,
            bestTimeToCall: property.bestTimeToCall || 'Not specified', // Default if missing
            email: property.email || 'Not provided', // Default if missing
            views: property.views || 0, // Default views to 0 if missing
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        // Extracting contact request details for buyers
        const propertiesData = propertiesWithContactRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            propertyDetails: property.propertyDetails || 'No details available', // Fallback value
            contactRequesters: property.contactRequests.map(request => request.phoneNumber),
            bestTimeToCall: property.bestTimeToCall || 'Not specified',
            email: property.email || 'Not provided',
            views: property.views || 0,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        return res.status(200).json({
            message: 'Contact request data fetched successfully',
            contactRequestsData,
            propertiesData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// Delete all contact requests for a specific property (ppcId)
router.delete('/delete-contact/:ppcId', async (req, res) => {
    try {
        const { ppcId } = req.params;

        // Clear all contact requests for the property
        const updatedProperty = await AddModel.findOneAndUpdate(
            { ppcId },
            { $set: { contactRequests: [] } }, // Removes all contact requests
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found or no contact requests to delete.' });
        }

        return res.status(200).json({ message: 'All contact requests removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




// **************** Report Property **************




router.post('/report-property', async (req, res) => {
    const { phoneNumber, ppcId, reportReason } = req.body;

    try {
        const property = await AddModel.findOne({ ppcId });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const isAlreadyInterested = property.reportProperty.some(
            (request) => request.phoneNumber === phoneNumber
          );
      
          if (isAlreadyInterested) {
            return res.status(400).json({
              message: "You have already shown Reported Property in this property.",
              status: "alreadySaved",
            });
          }

        // Add the phone number and reason to the reportedProperty array
        await AddModel.updateOne(
            { ppcId },
            { 
                $push: { reportProperty: { phoneNumber, reportReason } },
                // $inc: { views: 1 }, 
                $set: { updatedAt: Date.now() }
            }
        );

        return res.status(200).json({
            message: 'Your report has been recorded!',
            status: 'reportProperties',
            postedUserPhoneNumber: property.phoneNumber,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            price: property.price,
            area: property.area,
            ownerName : property.ownerName,
            views: property.views, // Return the updated views count


        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




router.get('/get-reportproperty-buyer', async (req, res) => {
    const { postedPhoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!postedPhoneNumber) {
        return res.status(400).json({ message: 'Posted user phone number is required.' });
    }

    try {
        // Fetch properties where the buyer has made a helpRequest
        const propertiesWithBuyerreportPropertyRequests = await AddModel.find({
            phoneNumber: postedPhoneNumber  // Match posted user (owner's) phone number
        });

        if (propertiesWithBuyerreportPropertyRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found for this buyer help request.' });
        }

        // Map properties to include details about the help requests
        const reportPropertyRequestsData = propertiesWithBuyerreportPropertyRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Owner's phone number
            propertyDetails: property.propertyDetails,  
            reportPropertyRequestersPhoneNumbers: property.reportProperty.map(req => req.phoneNumber) // All interested users
        }));

        return res.status(200).json({
            message: 'Properties with help requests fetched successfully.',
            reportPropertyRequestsData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.get('/get-reportproperty-owner', async (req, res) => {
    const { phoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required.' });
    }

    try {
        // Fetch properties where the phone number is included in the helpRequests
        const propertiesWithreportPropertyRequests = await AddModel.find({
            'reportProperty.phoneNumber': phoneNumber
        });

        if (propertiesWithreportPropertyRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found with help requests for this phone number.' });
        }

        const reportPropertyRequestsData = propertiesWithreportPropertyRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            reportPropertyRequestedUserPhoneNumbers: Array.isArray(property.reportPropertyRequests) ? 
                property.reportPropertyRequests.map(request => request.phoneNumber) : [],  
            propertyMode: property.propertyMode,          // Mode (Rent/Sale)
            propertyType: property.propertyType,          // Type (House, Apartment)
            price: property.price,                        // Price of the property
            area: property.area,
        }));

        return res.status(200).json({ message: 'Help requests fetched successfully', reportPropertyRequestsData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/get-all-reportproperty-requests', async (req, res) => {
    try {
        // Fetch all properties where report property requests exist
        const propertiesWithReportRequests = await AddModel.find({ reportProperty: { $exists: true, $ne: [] } });

        // If no report property requests are found
        if (propertiesWithReportRequests.length === 0) {
            return res.status(404).json({ message: 'No report property requests found.' });
        }

        // Extracting report property request details for owners
        const reportPropertyRequestsData = propertiesWithReportRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            reportRequestedUserPhoneNumbers: property.reportProperty.map(request => request.phoneNumber),
            propertyMode: property.propertyMode, // Rent/Sale
            propertyType: property.propertyType, // House/Apartment
            price: property.price, // Property price
            area: property.area,
            views: property.views || 0, // Default views to 0 if missing
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        // Extracting report property request details for buyers
        const propertiesData = propertiesWithReportRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            propertyDetails: property.propertyDetails || 'No details available', // Fallback value
            reportRequesters: property.reportProperty.map(request => request.phoneNumber),
            views: property.views || 0,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        return res.status(200).json({
            message: 'Report property request data fetched successfully',
            reportPropertyRequestsData,
            propertiesData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// Delete all reported property requests for a specific property (ppcId)
router.delete('/delete-report/:ppcId', async (req, res) => {
    try {
        const { ppcId } = req.params;

        // Update the property by removing all reportProperty entries
        const updatedProperty = await AddModel.findOneAndUpdate(
            { ppcId },
            { $set: { reportProperty: [] } }, // Clears all reported requests
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found or no report to delete.' });
        }

        return res.status(200).json({ message: 'All reported property requests removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




// **************Sold Out **********


router.post('/report-sold-out', async (req, res) => {
    const { phoneNumber, ppcId } = req.body;

    try {
        const property = await AddModel.findOne({ ppcId });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const isAlreadyInterested = property.soldOutReport.some(
            (request) => request.phoneNumber === phoneNumber
          );
      
          if (isAlreadyInterested) {
            return res.status(400).json({
              message: "You have already shown Sold Out in this property.",
              status: "alreadySaved",
            });
          }

        // Add the phone number to the soldOutReport array
        await AddModel.updateOne(
            { ppcId },
            { 
                $push: { soldOutReport: { phoneNumber } },  
                $set: { status: 'soldOut' },
                // $inc: { views: 1 }, 
                $set: { updatedAt: Date.now() }
            }
        );

        return res.status(200).json({
            message: 'The property has been marked as sold out.',
            status: 'soldOut',
            postedUserPhoneNumber: property.phoneNumber,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            price: property.price,
            area: property.area,
            ownerName : property.ownerName,
            views: property.views, // Return the updated views count


        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.get('/get-soldout-buyer', async (req, res) => {
    const { postedPhoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!postedPhoneNumber) {
        return res.status(400).json({ message: 'Posted user phone number is required.' });
    }

    try {
        // Fetch properties where the buyer has made a helpRequest
        const propertiesWithBuyersoldOutRequests = await AddModel.find({
            phoneNumber: postedPhoneNumber  // Match posted user (owner's) phone number
        });

        if (propertiesWithBuyersoldOutRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found for this buyer soldout request.' });
        }

        // Map properties to include details about the help requests
        const soldOutRequestsData = propertiesWithBuyersoldOutRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Owner's phone number
            propertyDetails: property.propertyDetails,  
            soldOutRequestersPhoneNumbers: property.soldOutReport.map(req => req.phoneNumber) // All interested users
        }));

        return res.status(200).json({
            message: 'Properties with help requests fetched successfully.',
            soldOutRequestsData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/get-soldout-owner', async (req, res) => {
    const { phoneNumber } = req.query;  // Extract phoneNumber from query parameters

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required.' });
    }

    try {
        console.log('Querying with phoneNumber:', phoneNumber);

        // Use $elemMatch to find documents where soldOutReport contains an object with the specified phoneNumber
        const propertiesWithSoldOutRequests = await AddModel.find({
            // soldOutReport: { $elemMatch: { phoneNumber: phoneNumber } }
            'soldOutReport.phoneNumber': phoneNumber

        });


        if (propertiesWithSoldOutRequests.length === 0) {
            return res.status(404).json({
                message: 'No properties found with soldout requests for this phone number.',
                phoneNumber
            });
        }

        // Map over the results to structure the response
        const soldOutRequestsData = propertiesWithSoldOutRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            soldOutRequestedUserPhoneNumbers: Array.isArray(property.soldOutReport) ?
                property.soldOutReport.map(request => request.phoneNumber) : [],  
            propertyMode: property.propertyMode,          // Mode (Rent/Sale)
            propertyType: property.propertyType,          // Type (House, Apartment)
            price: property.price,                        // Price of the property
            area: property.area,
        }));

        return res.status(200).json({ message: 'Soldout requests fetched successfully', soldOutRequestsData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.get('/get-all-soldout-requests', async (req, res) => {
    try {
        // Fetch all properties where sold-out requests exist
        const propertiesWithSoldOutRequests = await AddModel.find({ soldOutReport: { $exists: true, $ne: [] } });

        // If no sold-out properties are found
        if (propertiesWithSoldOutRequests.length === 0) {
            return res.status(404).json({ message: 'No sold-out requests found.' });
        }

        // Extracting sold-out request details for owners
        const soldOutRequestsData = propertiesWithSoldOutRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            soldOutRequestedUserPhoneNumbers: property.soldOutReport.map(request => request.phoneNumber),
            propertyMode: property.propertyMode, // Rent/Sale
            propertyType: property.propertyType, // House/Apartment
            price: property.price, // Property price
            area: property.area,
            views: property.views || 0, // Default views to 0 if missing
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        // Extracting sold-out request details for buyers
        const propertiesData = propertiesWithSoldOutRequests.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            propertyDetails: property.propertyDetails || 'No details available', // Fallback value
            soldOutRequesters: property.soldOutReport.map(request => request.phoneNumber),
            views: property.views || 0,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        return res.status(200).json({
            message: 'Sold-out request data fetched successfully',
            soldOutRequestsData,
            propertiesData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// Delete a sold-out request for a specific property (ppcId)
router.delete('/delete-soldout/:ppcId', async (req, res) => {
    try {
        const { ppcId } = req.params;  // Extract PPC ID from URL params

        // Update the property by pulling out the soldOutReport entry
        const updatedProperty = await AddModel.findOneAndUpdate(
            { ppcId },
            { $pull: { soldOutReport: { phoneNumber: { $exists: true } } } },
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found or no sold-out request to delete.' });
        }

        return res.status(200).json({ message: 'Sold-out request removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



// ********************* favorite***********

// Add a property to favorites
router.post('/add-favorite', async (req, res) => {
    const { phoneNumber, ppcId } = req.body;

    if (!phoneNumber || !ppcId) {
        return res.status(400).json({ message: 'Phone number and Property ID are required' });
    }

    try {
        const property = await AddModel.findOne({ ppcId });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Add to favorites ensuring uniqueness using $addToSet
        await AddModel.updateOne(
            { ppcId },
            {
                $addToSet: { favoriteRequests: { phoneNumber } }, 
                $set: { status: 'favorite' },
                // $inc: { views: 1 }, 
                $set: { updatedAt: Date.now() }
            }
        );

        return res.status(200).json({
            message: 'Property added to your favorites!',
            status: 'favorite',
            postedUserPhoneNumber: property.phoneNumber,
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            price: property.price,
            area: property.area,
            ownerName : property.ownerName,
            views: property.views, // Return the updated views count
            favoriteRequests: property.favoriteRequests.map((fav) => fav.phoneNumber), // List of users who favorited
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



// Get properties that a specific user has favorited
router.get('/get-favorite-owner', async (req, res) => {
    try {
        const { phoneNumber } = req.query; // Extract phoneNumber from query parameters

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required." });
        }

        // Find properties where the user has favorited
        const propertiesWithFavorites = await AddModel.find({
            "favoriteRequests.phoneNumber": phoneNumber, // Corrected query
        });

        if (propertiesWithFavorites.length === 0) {
            return res.status(404).json({ message: "No favorite properties found for this phone number." });
        }

        // Format response
        const favoriteRequestsData = propertiesWithFavorites.map((property) => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            favoritedUserPhoneNumbers: property.favoriteRequests.map((fav) => fav.phoneNumber), // List of users who favorited
            propertyMode: property.propertyMode,
            propertyType: property.propertyType,
            price: property.price,
            area: property.area,
        }));

        return res.status(200).json({
            message: "Favorite properties fetched successfully",
            favoriteRequestsData,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



router.get('/get-favorite-buyer', async (req, res) => {
    const { postedPhoneNumber } = req.query;  // Extract owner's phone number

    if (!postedPhoneNumber) {
        return res.status(400).json({ message: 'Posted user phone number is required.' });
    }

    try {
        // Fetch properties listed by the given owner
        const propertiesWithFavoriteRequests = await AddModel.find({
            phoneNumber: postedPhoneNumber  // Match properties listed by the owner
        });

        if (propertiesWithFavoriteRequests.length === 0) {
            return res.status(404).json({ message: 'No properties found for this owner.' });
        }

        // Map properties to include details about the favorite requests
        const favoriteRequestsData = propertiesWithFavoriteRequests.map(property => ({
            ppcId: property.ppcId,  // Property ID
            postedUserPhoneNumber: property.phoneNumber,  // Property owner's phone number
            propertyDetails: property.propertyDetails || {},  // Property details
            favoritedUsersPhoneNumbers: property.favoriteRequests.map(req => req.phoneNumber) || [] // List of users who favorited
        }));

        return res.status(200).json({
            message: 'Properties with favorite requests fetched successfully.',
            favoriteRequestsData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.get('/get-all-favorite-requests', async (req, res) => {
    try {
        // Fetch all properties where favorite requests exist
        const propertiesWithFavorites = await AddModel.find({ favoriteRequests: { $exists: true, $ne: [] } });

        // If no favorite properties are found
        if (propertiesWithFavorites.length === 0) {
            return res.status(404).json({ message: 'No favorite properties found.' });
        }

        // Extracting favorite request details for owners
        const favoriteRequestsData = propertiesWithFavorites.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            favoritedUserPhoneNumbers: property.favoriteRequests.map(fav => fav.phoneNumber),
            propertyMode: property.propertyMode, // Rent/Sale
            propertyType: property.propertyType, // House/Apartment
            price: property.price, // Property price
            area: property.area,
            // ownerName: property.ownerName || 'Unknown', // Fallback if owner name is missing
            views: property.views || 0, // Default views to 0 if missing
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        // Extracting favorite request details for buyers
        const propertiesData = propertiesWithFavorites.map(property => ({
            ppcId: property.ppcId,
            postedUserPhoneNumber: property.phoneNumber, // Property owner's phone number
            propertyDetails: property.propertyDetails || 'No details available', // Fallback value
            favoritedUsers: property.favoriteRequests.map(fav => fav.phoneNumber),
            views: property.views || 0,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt
        }));

        return res.status(200).json({
            message: 'Favorite request data fetched successfully',
            favoriteRequestsData,
            propertiesData
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// Delete a favorite request for a specific property (ppcId)
router.delete('/delete-favorite/:ppcId', async (req, res) => {
    try {
        const { ppcId } = req.params;  // Extract PPC ID from URL params

        // Update the property by pulling out the favoriteRequests entry
        const updatedProperty = await AddModel.findOneAndUpdate(
            { ppcId },
            { $pull: { favoriteRequests: { phoneNumber: { $exists: true } } } },
            { new: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found or no favorite request to delete.' });
        }

        return res.status(200).json({ message: 'Favorite request removed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});



router.post('/remove-favorite', async (req, res) => {
    const { phoneNumber, ppcId } = req.body;

    if (!phoneNumber || !ppcId) {
        return res.status(400).json({ message: 'Phone number and Property ID are required' });
    }

    try {
        const property = await AddModel.findOne({ ppcId });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Ensure `favoriteRequests` is an array before checking
        const isFavorite = (property.favoriteRequests || []).some(fav => fav.phoneNumber === phoneNumber);

        if (!isFavorite) {
            return res.status(400).json({
                message: 'This property is not in your favorites.',
                status: 'notFavorite',
            });
        }

        // Update the database to remove the favorite
        await AddModel.updateOne(
            { ppcId },
            {
                $pull: { favoriteRequests: { phoneNumber } }, // Ensure correct field is being updated
                $push: { favoriteRemoved: { phoneNumber } },
                $set: { status: 'favoriteRemoved' },
            }
        );

        // Fetch updated property after removal
        const updatedProperty = await AddModel.findOne({ ppcId });

        return res.status(200).json({
            message: 'Property removed from your favorites!',
            status: 'favoriteRemoved',
            postedUserPhoneNumber: updatedProperty.phoneNumber,
            propertyMode: updatedProperty.propertyMode,
            propertyType: updatedProperty.propertyType,
            price: updatedProperty.price,
            area: updatedProperty.area,
            favorite: updatedProperty.favoriteRequests?.map(fav => fav.phoneNumber) || [],
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




// **************** Delete And Undo Property Actions *****************


// Delete property endpoint
router.post('/delete-detail-property', async (req, res) => {
    const { ppcId, phoneNumber } = req.body;
  
    try {
      // Find the property by its ppcId and phoneNumber
      const property = await AddModel.findOne({ ppcId });
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found.' });
      }
  
      // Check if the user's phone number is in the interestRequests array
      const userInterestIndex = property.interestRequests.findIndex(request => request.phoneNumber === phoneNumber);
      if (userInterestIndex !== -1) {
        // If the user is interested, remove their interest or handle as needed
        property.interestRequests.splice(userInterestIndex, 1);  // Remove the user's interest
      }
  
      // Change the property status to 'delete'
      property.status = 'delete';
      await property.save();
  
      // Send the updated property as a response
      res.status(200).json({ message: 'Property removed successfully.', property });
    } catch (error) {
      res.status(500).json({ message: 'Error removing property.' });
    }
  });
  



// Undo delete property endpoint
router.post('/undo-delete-detail', async (req, res) => {
    const { ppcId, phoneNumber } = req.body;
  
    try {
      // Find the property by its ppcId
      const property = await AddModel.findOne({ ppcId });
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found.' });
      }
  
      // Revert the property status to 'incomplete' or whatever was the previous status
      property.status = 'incomplete'; // Or 'complete', based on the previous status
      // Optionally, add the user's interest request back (if you need to track that)
      if (!property.interestRequests.some(request => request.phoneNumber === phoneNumber)) {
        property.interestRequests.push({ phoneNumber, date: new Date() });
      }
  
      await property.save();
  
      // Send the updated property as a response
      res.status(200).json({ message: 'Property status reverted successfully!', property });
    } catch (error) {
      res.status(500).json({ message: 'Error undoing property status.' });
    }
  });
  




module.exports = router;
