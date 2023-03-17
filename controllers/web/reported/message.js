//Modal Imported
const messagereportModal = require('../../../models/message/message_report');
const usersModal = require('../../../models/users/users');
const profileModal = require('../../../models/users/profile');

module.exports = {
	/*
     *	Function:  MESSAGE_REPORTED
     *	@Params: 
     *      - 
    **/
    MESSAGE_REPORTED: async function (data, callback) {
    	console.log("data>>>",data)
    	//send data
    	var sendData = {
    		ReturnCode : 200,
    		err : 0,
    		Data : {},
    		ReturnMsg : ""
    	};

    	//defina all variable
    	const limit = (typeof data.limit != "undefined") ? parseInt(data.limit) : 10;
		const start = (typeof data.start != "undefined") ? (parseInt(data.start) * limit) : 0;
		const user_id = data._id;

		//condition for reported message
		const reportmsgcondition = [
			{
				$lookup: {
					"from": "users",
					"localField": "sender_id",
					"foreignField": "_id",
					"as": "user"
				}
			},
			{ $unwind: "$user" },
			{
				$lookup: {
					"from": "profile",
					"localField": "sender_id",
					"foreignField": "user_id",
					"as": "secprofile"
				}
			},
			{ $unwind: "$secprofile" },
			{ $match: { "secprofile.profile_type": 1 } },
			{
				$lookup: {
					"from": "profile",
					"localField": "sender_id",
					"foreignField": "user_id",
					"as": "realprofile"
				}
			},
			{ $unwind: "$realprofile" },
			{ $match: { "realprofile.profile_type": 0 } },
			{
				$project: {
					"message":"$message_id",
					"reported":"$user.reported",
					"report":"$report",
					"name":{$cond: {if: {$gt:["$user.reported", 19] }, then: "$realprofile.name", else: "$secprofile.name"}},
					"profile_pic": {$cond: {if: {$gt:["$user.reported", 19] }, then: "$realprofile.profile_pic", else: "$secprofile.profile_pic"}},
				}
			}
		];
		const reportData = await messagereportModal.aggregate(reportmsgcondition);

		//condition for logindata

		const selectFields = {
			_id : 0,	
			name:1,
			profile_pic:1
		}
		const logincondition = {
			user_id : mongoose.mongo.ObjectId(data.user_id.toString()),
			profile_type : 1
		};
		const logindata = await profileModal.find(logincondition,selectFields);

		if(reportData.length > 0) {
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['Data'] = {reportData :reportData,profile:logindata};
			sendData['ReturnMsg'] = "Report data retrive";
			callback(sendData);
		} else {
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['Data'] = {};
			sendData['ReturnMsg'] = "Report data retrive";
			callback(sendData);
		}
    }
}