const mongoose = require("mongoose");


const BuyerAssistanceSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  altPhoneNumber: String,
  city: { type: String, required: true },
  area: { type: String, required: true },
  loanInput: String,
  minPrice: String,
  maxPrice: String,
  areaUnit: String,
  noOfBHK: String,
  propertyMode: String,
  propertyType: String,
  propertyAge: String,
  bankLoan: { type: String, }, 
  propertyApproved: { type: String,  }, 
  facing: String,
  state: { type: String},
 
  paymentType: { type: String, required: true },
  description: String,
}, { timestamps: true });


module.exports = mongoose.model("BuyerAssistance", BuyerAssistanceSchema);
