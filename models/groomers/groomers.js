groomers_schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    mobile_number: {
    
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default:0
    },
    country_code:{
        type:String,
        required:true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    deleted:{
        type:Boolean,
        default:false
    },
    active: {
        type: Boolean,
        default:true,
       required: true
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    }
})

const groomers_model = mongoose.model('groomers', groomers_schema);
module.exports = groomers_model;
