//This gives us the UI for loans and we have to add data here
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    customerName: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    address: {
        type: String
    },
    loanAmount:{
        type: Number
    },
    interest: {
        type: Number
    },
    loanTermYears: {
        type: Number
    },
    loanType: {
        type: String
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    insertedDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Loan', loanSchema);