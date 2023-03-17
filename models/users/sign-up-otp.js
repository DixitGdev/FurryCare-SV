signupotpverificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    },
    created_at: {
        type: Date,
        default: new Date()
    },
});
const signupotp = mongoose.model('signup_otp', signupotpverificationSchema);
module.exports = signupotp;
