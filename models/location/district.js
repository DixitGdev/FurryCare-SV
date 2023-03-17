districtSchema = new mongoose.Schema({
    city_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pin_code: {
        type: String,
        required: true
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

const districtModel = mongoose.model('district', districtSchema);
module.exports = districtModel;
