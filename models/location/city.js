citySchema = new mongoose.Schema({
    state_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    long: {
        type: String,
        required: true
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

const cityModel = mongoose.model('city', citySchema);
module.exports = cityModel;
