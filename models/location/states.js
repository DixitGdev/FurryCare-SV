stateSchema = new mongoose.Schema({
    country_code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    created_at:{
        type:Date,
        default:new Date()
    }
});

const statesModel = mongoose.model('states', stateSchema);
module.exports = statesModel;
