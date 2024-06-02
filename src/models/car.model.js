import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  model: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
 
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // cloudinary url

  },
  seatingCapacity: {
    type: Number,
  },
  engine: {
    type: String,
  },
  transmission: {
    type: String,
  },
  fuelEfficiency: {
    type: String,
  },
  color: {
    type: String,
    lowercase: true,
  },
  range: {
    type: String,
  },
  acceleration: {
    type: String,
  },
  chargingTime: {
    type: String,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  availability: {
    type: String,
    enum: ['inStock', 'outOfStock'],
    default: 'inStock',
  },
}, { timestamps: true });

export const Car = mongoose.model('Car', carSchema);

