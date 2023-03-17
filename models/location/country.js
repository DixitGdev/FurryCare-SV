countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

const countryModel = mongoose.model('country', countrySchema);
module.exports = countryModel;
