const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    image: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    seats: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
