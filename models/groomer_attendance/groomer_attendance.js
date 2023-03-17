const { default: mongoose } = require("mongoose");

groomer_attendance = new mongoose.Schema({
    groomer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },  
    date:{
        type: Date,
        require: true,
    },
    start_time: {
      type: Date,
      require: true,
    },
    end_time: {
      type: Date,
      require: true,
    },
    total_hours:{
    type: String,
      require: true,
      default:'0'
    },
   

    break_hours:{
    type: String,
      require: true,
      default:'0'
    },
    working_hours:{
      type: String,
        require: true,
        default:'0'
      },

    early_reason: {
      type: String,
     // required: true,
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
  
  const groomer_attendance_model = mongoose.model("groomer attendance", groomer_attendance);
  module.exports = groomer_attendance_model;
  