const { default: mongoose } = require("mongoose")

contact_us_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile_number: {
    
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    subject:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true
    },
    created_at: {
        type: Date,
        default: new Date(),
      },
      updated_at: {
        type: Date,
        default: new Date(),
      },
})

const contact_us_model= mongoose.model("contact_us",contact_us_schema)
module.exports= contact_us_model;
