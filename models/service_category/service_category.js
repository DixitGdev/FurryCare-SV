const { default: mongoose } = require("mongoose");

service_category = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    icon: {
        type: String,
        required: true,

    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        default:null,
        required:false
    },
    deleted:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
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

const service_categoryModal = mongoose.model("service_category", service_category);
module.exports = service_categoryModal;