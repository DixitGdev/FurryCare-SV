const { default: mongoose } = require("mongoose");

groomer_break = new mongoose.Schema({
    groomer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    date:{
        type: Date,
        require: true,
    }, 
    break_in: {
      type: Date,
      require: true,
    },
    break_out: {
      type: Date,
      require: true,
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
  
  const groomer_break_model = mongoose.model("groomer_break", groomer_break);
  module.exports = groomer_break_model;
  