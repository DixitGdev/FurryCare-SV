otpVerificationSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    otp: {
        type: String,
        required: false,
    },
    created_at:{
        type:Date,
        default: new Date()
    },
    expired_at:{
        type:Date,
        default: new Date()
    }
})

const otpVerification = mongoose.model('otp_verification', otpVerificationSchema);
module.exports = otpVerification;