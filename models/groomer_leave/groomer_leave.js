groomer_leave = new mongoose.Schema({
  groomer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  start_date: {
    type: Date,
    require: true,
  },
  end_date: {
    type: Date,
    require: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  deleted: {
    type: Boolean,
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

const groomer_leave_model = mongoose.model("groomer_leave", groomer_leave);
module.exports = groomer_leave_model;
