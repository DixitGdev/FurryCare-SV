holidaySchema = new mongoose.Schema({
    
    title:{
        type:String,
        require:true,
    },
    year:{
        type:String,
        require:true,
    },
    date: {
    	type: String,
        require : true
    },
    deleted: {
    	type: Boolean,
        default : false,
        require : true
    },
    active: {
    	type: Boolean,
        default : true,
        require : true
    },
    created_at:{
        type:Date,
        default:new Date()
    },

})

const holidayModel = mongoose.model("holiday",holidaySchema);
module.exports = holidayModel;