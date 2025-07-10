const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mileage: {
    type: Number,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  imageUrls: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema); 