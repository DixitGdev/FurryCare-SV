const { default: mongoose } = require("mongoose");

packagesSchema = new mongoose.Schema({
    category_id: {
    	type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    subcategory_id: {
    	type:mongoose.Schema.Types.ObjectId,
        required : false,
        default : null
    },
    title: {
        type : String,
        require : true,
        trim : true
    },
    description: {
        type : String,
        require : true,
        trim : true
    },
    deleted: {
        type : Boolean,
        require : true,
        default : false
    },
    price: {
        type : Number,
        require : true
    },
    city: {
        type:mongoose.Schema.Types.ObjectId,
        require : true,
        trim : true
    },
    pet: {
        type : String,
        require : true,
        default : "dog"
    },
    state: {
        type:mongoose.Schema.Types.ObjectId,
        require : true,
        trim : true
    },
    country: {
        type : String,
        require : true,
        trim : true
    },
    created_at:{
        type:Date,
        default:new Date()
    },
    updated_at:{
        type:Date,
        default:new Date()
    }
})

const packagesModel = mongoose.model("packages",packagesSchema);
module.exports = packagesModel;