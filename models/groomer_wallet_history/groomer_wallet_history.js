const { default: mongoose } = require("mongoose");

groomer_wallet_history = new mongoose.Schema({
    
    groomer_id:{
     type:   mongoose.Schema.Types.ObjectId  ,
        require:true
    },

    date: {
    	type: Date,
        require : true
    },
    amount:{
        type:Number,
        
    },
    final_amount:{
        type:Number,
    },
    type:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    created_at:{
        type:Date,
        default:new Date()
    },
    updated_at:{
        type:Date,
        default:new Date()
    },

})

const groomer_wallet_historymodel = mongoose.model("groomer_wallet_history",groomer_wallet_history);
module.exports = groomer_wallet_historymodel;