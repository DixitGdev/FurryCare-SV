//Modal Imported
const profileModal = require('../../../models/users/profile');
const userModal = require('../../../models/users/users');
const communityModal = require('../../../models/community/community');
const communityMemberModal = require('../../../models/community/community_member');
const communityInvitationModal = require('../../../models/community/community_invitation');
const communityReportModal = require('../../../models/community/community_report');

module.exports = {
	/*
     *	Function:  MESSAGE_REPORTED
     *	@Params: 
     *      - 
    **/
    COMMUNITY_REPORTED: async function (data, callback) {
    	//send data
    	var sendData = {
    		ReturnCode : 200,
    		err : 0,
    		Data : {},
    		ReturnMsg : ""
    	};

    	//define all variable
    	const limit = (typeof data.limit != "undefined") ? parseInt(data.limit) : 10;
		const start = (typeof data.start != "undefined") ? (parseInt(data.start) * limit) : 0;

		//Condition for reported community
		const reportcommunitycondition = [
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
					"from": "community",
					"localField": "community_id",
					"foreignField": "_id",
					"as": "community"
				}
			},
			{ $unwind: "$community" },
			{
				$project: {
					"community_id":"$community_id",
					"community_name":"$community.name",
					"report":"$report",
					"reporter_id":"$user_id",
					"reporter_name":"$secprofile.name",
					"reporter_profile":"$secprofile.profile_pic",
				}
			}
		];
		const reportData = await communityReportModal.aggregate(reportcommunitycondition);

		if(reportData.length > 0) {
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['Data'] = reportData;
			sendData['ReturnMsg'] = "Reported community Retrive!";
			callback(sendData);
		} else {
			sendData['ReturnCode'] = 403;
			sendData['err'] = 1;
			sendData['Data'] = [];
			sendData['ReturnMsg'] = "Reported community Retrive!";
			callback(sendData);
		}
    }
}