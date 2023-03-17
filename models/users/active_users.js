activeuserSchema = new mongoose.Schema({
	user_id: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    current_date: {
    	type:String,
        default:new Date()
    },
    api: {
    	type: Number,
        default: 1
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

const activeuserModal = mongoose.model("active_user",activeuserSchema);
module.exports = activeuserModal;