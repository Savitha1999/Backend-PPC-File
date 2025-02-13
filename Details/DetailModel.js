// const mongoose = require('mongoose');



// const DetailSchema = new mongoose.Schema(
//     {
//   phoneNumber: 
//   { 
//     type: String, required: true, index: true 
//   }, 

//   ppcId: 
//   { 
//     type: Number, unique: true 
//   },
 
//   status: {
//     type: String,
//     enum: ['sendInterest', 'soldOut', 'reportProperty', 'needHelp', 'contact'],
//   },

//   interestRequests: [{ 
//     phoneNumber: { type: String }, 
//     date: { type: Date }           
//   }], 

//   helpRequests: [
//     {
//         phoneNumber: { type: String }
//     }
// ],
// soldOutReport: [
//   {
//       phoneNumber: { type: String }
//   }
// ],
// reportProperty: [
//   {
//       phoneNumber: { type: String, required: true }
//   }
// ],


//  },
//    {
//     timestamps: true, 
//     }
// )

// module.exports = mongoose.model('DetailModel', DetailSchema);
