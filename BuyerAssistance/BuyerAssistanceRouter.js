

const express = require("express");
const router = express.Router();
const BuyerAssistance = require("../BuyerAssistance/BuyerAssistanceModel");




// Add Buyer Assistance
router.post("/add-buyerAssistance", async (req, res) => {
  try {
    const newRequest = new BuyerAssistance(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Buyer Assistance request added successfully!", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error adding Buyer Assistance request", error });
  }
});

// Update Buyer Assistance
router.put("/update-buyerAssistance/:id", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request updated successfully!", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating Buyer Assistance request", error });
  }
});

// Update Buyer Assistance using Phone Number
router.put("/update-buyerAssistance-phone/:phoneNumber", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      req.body,
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request updated successfully!", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating Buyer Assistance request", error });
  }
});


// Fetch All Buyer Assistance Requests
router.get("/fetch-buyerAssistance", async (req, res) => {
  try {
    const requests = await BuyerAssistance.find();
    res.status(200).json({ message: "Buyer Assistance requests fetched successfully!", data: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Buyer Assistance requests", error });
  }
});


// Update Buyer Assistance by ID
router.put("/update-buyerAssistance/:id", async (req, res) => {
  try {
    const updatedRequest = await BuyerAssistance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request updated successfully!", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating Buyer Assistance request", error });
  }
});


// Fetch Single Buyer Assistance Request by ID
router.get("/fetch-buyerAssistance/:id", async (req, res) => {
  try {
    const request = await BuyerAssistance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request fetched successfully!", data: request });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Buyer Assistance request", error });
  }
});

// Delete Buyer Assistance Request
router.delete("/delete-buyerAssistance/:id", async (req, res) => {
  try {
    const deletedRequest = await BuyerAssistance.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Buyer Assistance request deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Buyer Assistance request", error });
  }
});



module.exports = router;
