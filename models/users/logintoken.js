logintokenSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    token:{
        type: String,
        default:''
    },
    platform:{
        type: String,
        default: ''
    },
    fcm_token: {
        type: String,
        default: ''
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

const logintoken = mongoose.model('login_token', logintokenSchema);
module.exports = logintoken;