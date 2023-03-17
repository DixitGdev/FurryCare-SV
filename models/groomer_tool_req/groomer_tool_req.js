const { default: mongoose } = require("mongoose");

groomer_tool_req_Schema = new mongoose.Schema({
  groomer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
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

const groomer_tool_req_model = mongoose.model(
  "groomer_tool_req",
  groomer_tool_req_Schema
);
module.exports = groomer_tool_req_model;
