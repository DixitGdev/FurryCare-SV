loginschema = new mongoose.Schema({
    mobile_number:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        default: ''
    },
    password:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    email_verify:{
        type:Boolean,
        default:false
    },
    country_code:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:new Date()
    },
    updated_at:{
        type:Date,
        default:new Date()
    },
    deleted:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model('users', loginschema);
module.exports = userModel;