// const express = require('express');
// const router = express.Router();
// const DataModel = require('../SendDataAdmin/DataModel');


// // Add API
// router.post('/add', async (req, res) => {
//     try {
//       const newAdd = new DataModel(req.body);
//       await newAdd.save();
//       res.status(201).json({ message: 'Record added successfully', data: newAdd });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });
  
//   // Fetch API
//   router.get('/fetch', async (req, res) => {
//     try {
//       const data = await DataModel.find();
//       res.status(200).json({ data });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });


  
//   // router.get('/latest-ppcid', async (req, res) => {
//   //     try {
//   //         const latestProperty = await AddModel.findOne().sort({ ppcId: -1 });
//   //         res.json({ latestPpcId: latestProperty ? latestProperty.ppcId : null });
//   //     } catch (error) {
//   //         res.status(500).json({ message: 'Error fetching latest ppcId', error });
//   //     }
//   // });


//   // Update existing record
// router.put('/update/:id', async (req, res) => {
//   try {
//     const updatedData = await DataModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedData) {
//       return res.status(404).json({ message: 'Record not found' });
//     }
//     res.status(200).json({ message: 'Record updated successfully', data: updatedData });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Delete record
// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const deletedData = await DataModel.findByIdAndDelete(req.params.id);
//     if (!deletedData) {
//       return res.status(404).json({ message: 'Record not found' });
//     }
//     res.status(200).json({ message: 'Record deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.post('/adds', async (req, res) => {
//   const { field, value } = req.body;

//   if (!field || !value) {
//     return res.status(400).json({ error: "Field and value are required" });
//   }

//   try {
//     // Dynamically create an object with the field and value
//     const newData = new DataModel({ [field]: value });
//     await newData.save();

//     res.status(201).json({ message: "Data added successfully", data: newData });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });






// router.put('/update', async (req, res) => {
//   const { field, value, newValue } = req.body;

//   if (!field || !value || !newValue) {
//     return res.status(400).json({ error: "Field, value, and newValue are required" });
//   }

//   try {
//     const updatedData = await DataModel.findOneAndUpdate(
//       { [field]: value },
//       { [field]: newValue },
//       { new: true }
//     );

//     if (!updatedData) {
//       return res.status(404).json({ message: "Record not found" });
//     }

//     res.status(200).json({ message: "Record updated successfully", data: updatedData });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.delete('/delete', async (req, res) => {
//   const { field, value } = req.body;

//   if (!field || !value) {
//     return res.status(400).json({ error: "Field and value are required" });
//   }

//   try {
//     const deletedData = await DataModel.findOneAndDelete({ [field]: value });
//     if (!deletedData) {
//       return res.status(404).json({ message: "Record not found" });
//     }
//     res.status(200).json({ message: "Record deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


// // *******************


// // Add API for propertyMode only
// router.post('/add-mode', async (req, res) => {
//   const { propertyMode } = req.body;

//   // Check if propertyMode is provided
//   if (!propertyMode) {
//     return res.status(400).json({ error: "propertyMode is required" });
//   }

//   try {
//     // Create a new document with only the propertyMode field
//     const newAdd = new DataModel({ propertyMode });
//     await newAdd.save();

//     res.status(201).json({ message: 'propertyMode added successfully', data: newAdd });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });



//   module.exports = router;
















const express = require('express');
const router = express.Router();
const DataModel = require('../SendDataAdmin/DataModel'); // Import your schema

// Add API to store individual fields
router.post('/add', async (req, res) => {
  const { field, value } = req.body;

  // Validate input
  if (!field || !value) {
    return res.status(400).json({ error: "Field and value are required" });
  }

  try {
    // Create and save a new document for the field
    const newAdd = new DataModel({ field, value });
    await newAdd.save();

    res.status(201).json({ message: 'Field added successfully', data: newAdd });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all fields
router.get('/fetch', async (req, res) => {
  try {
    const data = await DataModel.find(); // Fetch all documents
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update specific field
router.put('/update', async (req, res) => {
  const { field, value, newValue } = req.body;

  if (!field || !value || !newValue) {
    return res.status(400).json({ error: "Field, value, and newValue are required" });
  }

  try {
    // Find and update the field
    const updatedData = await DataModel.findOneAndUpdate(
      { field, value },  // Match by field name and current value
      { value: newValue },  // Update to the new value
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.status(200).json({ message: 'Field updated successfully', data: updatedData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete specific field
router.delete('/delete', async (req, res) => {
  const { field, value } = req.body;

  if (!field || !value) {
    return res.status(400).json({ error: "Field and value are required" });
  }

  try {
    // Find and delete the document
    const deletedData = await DataModel.findOneAndDelete({ field, value });

    if (!deletedData) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.status(200).json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  

module.exports = router;











// const express = require('express');
// const router = express.Router();
// const DataModel = require('../SendDataAdmin/DataModel');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// let interests = [];


// // Set up multer storage configuration
// const storage = multer.diskStorage({

//     destination: (req, file, cb) => {
//         const uploadDirectory = 'uploads/';
//         if (!fs.existsSync(uploadDirectory)) {
//             fs.mkdirSync(uploadDirectory, { recursive: true });
//         }
//         cb(null, uploadDirectory);
//     },
//     filename: (req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         const fileName = Date.now() + fileExtension; // Unique filename
//         cb(null, fileName);
//     },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
//   fileFilter: (req, file, cb) => {
//       const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov/; // Allowed file types
//       const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//       const mimetype = fileTypes.test(file.mimetype);
//       if (extname && mimetype) {
//           return cb(null, true); // Accept the file
//       } else {
//           return cb(new Error('Only image and video files (JPEG, PNG, GIF, MP4, AVI, MOV) are allowed!'), false);
//       }
//   },
// });



// // Add a new field
// router.post('/add', async (req, res) => {
//   const { field, value } = req.body;

//   if (!field || !value) {
//     return res.status(400).json({ error: 'Field and value are required' });
//   }

//   try {
//     const newField = new DataModel({ field, value });
//     await newField.save();
//     res.status(201).json({ message: 'Field added successfully', data: newField });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Fetch all fields
// router.get('/fetch', async (req, res) => {
//   try {
//     const data = await DataModel.find();
//     res.status(200).json({ data });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update a specific field
// router.put('/update', async (req, res) => {
//   const { field, value, newValue } = req.body;

//   if (!field || !value || !newValue) {
//     return res.status(400).json({ error: 'Field, value, and newValue are required' });
//   }

//   try {
//     const updatedField = await DataModel.findOneAndUpdate(
//       { field, value },
//       { value: newValue },
//       { new: true }
//     );

//     if (!updatedField) {
//       return res.status(404).json({ error: 'Field not found' });
//     }

//     res.status(200).json({ message: 'Field updated successfully', data: updatedField });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete a specific field
// router.delete('/delete', async (req, res) => {
//   const { field, value } = req.body;

//   if (!field || !value) {
//     return res.status(400).json({ error: 'Field and value are required' });
//   }

//   try {
//     const deletedField = await DataModel.findOneAndDelete({ field, value });

//     if (!deletedField) {
//       return res.status(404).json({ error: 'Field not found' });
//     }

//     res.status(200).json({ message: 'Field deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update property details
// router.post(
//   '/update-property',
//   upload.fields([{ name: 'video', maxCount: 1 }, { name: 'photos', maxCount: 15 }]),
//   async (req, res) => {
//     const { ppcId, phoneNumber, ...propertyDetails } = req.body;

//     if (!ppcId || !phoneNumber) {
//       return res.status(400).json({ message: 'PPC-ID and phone number are required.' });
//     }

//     try {
//       const user = await DataModel.findOne({ ppcId, phoneNumber });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found.' });
//       }

//       // Update property details
//       Object.assign(user, propertyDetails);

//       if (req.files['video']) {
//         user.video = req.files['video'][0].path;
//       }
//       if (req.files['photos']) {
//         user.photos = req.files['photos'].map(file => file.path);
//       }

//       await user.save();
//       res.status(200).json({ message: 'Property details updated successfully!', user });
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating property details.', error });
//     }
//   }
// );



// // Store new user data with PPC-ID
// router.post('/store-data', async (req, res) => {
//     const { phoneNumber } = req.body;
  
//     if (!phoneNumber) {
//       return res.status(400).json({ message: 'Phone number is required.' });
//     }
  
//     try {
//       console.log('Incoming request body:', req.body);
  
//       // Count the total documents to generate a unique PPC-ID
//       const count = await DataModel.countDocuments();
//       const ppcId = 1001 + count;
  
//       // Create new user with a new PPC-ID even if the phone number exists
//       const newUser = new DataModel({ phoneNumber, ppcId });
//       await newUser.save();
  
//       console.log('User stored successfully:', newUser);
//       res.status(201).json({ message: 'User added successfully!', ppcId });
//     } catch (error) {
//       console.error('Error storing user details:', error);
//       res.status(500).json({ message: 'Error storing user details.', error });
//     }
//   });

// module.exports = router;
