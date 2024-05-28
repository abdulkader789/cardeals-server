import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imageURL: {
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

const Car = mongoose.model('Car', carSchema);
export default Car;