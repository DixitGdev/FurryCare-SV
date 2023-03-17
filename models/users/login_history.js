loginHistorySchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

const loginHistory = mongoose.model('login_history', loginHistorySchema);
module.exports = loginHistory;