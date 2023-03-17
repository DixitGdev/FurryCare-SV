//Modal Imported
const profileModal = require('../../../models/users/profile');
const userModal = require('../../../models/users/users');
const messagereportModal = require('../../../models/message/message_report');

module.exports = {
	/*
     *	Function: USER_REPORTED_LIST
     *	@Params: 
     *      - 
    **/
    USER_LIST: async function (data, callback) {
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

		//condition for reported user list
		const reportusercondition = [
			{
            	$group: {
                _id: {user_id:'$user_id'},
                document: {$last: '$$ROOT'}
            	}
        	},
        	{ 
			    	$replaceRoot: { 
			    		newRoot: '$document' 
			    	} 
			    },
        	{ $skip: start },
			{ $limit: limit },
			{
				$lookup: {
					"from": "users",
					"localField": "user_id",
					"foreignField": "_id",
					"as": "user"
				}
			},
			{ $unwind: "$user" },
			{
				$lookup: {
					"from": "profile",
					"localField": "user_id",
					"foreignField": "user_id",
					"as": "secprofile"
				}
			},
			{ $unwind: "$secprofile" },
			{ $match: { "secprofile.profile_type": 1 } },
			{
				$lookup: {
					"from": "profile",
					"localField": "user_id",
					"foreignField": "user_id",
					"as": "realprofile"
				}
			},
			{ $unwind: "$realprofile" },
			{ $match: { "realprofile.profile_type": 0 } },

			{
				$project: {
					"user_id":"$user._id",
					"name": {$cond: {if: {$gt:["$user.reported", 19] }, then: "$realprofile.name", else: "$secprofile.name"}},
					"profile_pic": {$cond: {if: {$gt:["$user.reported", 19] }, then: "$realprofile.profile_pic", else: "$secprofile.profile_pic"}},
					"report_count":"$user.reported",

				}
			},
			{ $sort: { "user.reported": -1 } }
		];
		const reportData = await messagereportModal.aggregate(reportusercondition);

		if(reportData.length > 0) {
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['Data'] = reportData;
			sendData['ReturnMsg'] = "Reported user list retrive";
			callback(sendData);
		} else {
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['Data'] = {};
			sendData['ReturnMsg'] = "Reported user list retrive";
			callback(sendData);
		}
    }
}