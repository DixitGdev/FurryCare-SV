//loginHistoryModal imported
const loginHistoryModal = require('../../../models/users/login_history');

module.exports = {
	/*
		Function: __saveLoginHistory
	**/
	__saveLoginHistory: async function (data) {
		const user_id = data._id;
		const saveHistoryData = {
			user_id: mongoose.mongo.ObjectId(user_id.toString()),
			created_at: new Date()
		}
		const loginHistoryData = await loginHistoryModal.create(saveHistoryData);
	}
}
