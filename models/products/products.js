productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  productID: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    default: "Active",
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    default: new Date(),
  },
});

const product_model = mongoose.model("products", productSchema);
module.exports = product_model;
