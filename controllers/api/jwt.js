//usersModal imported
const logintokenModal = require('../../models/users/logintoken');
const activeuserModal = require('../../models/users/active_users');
module.exports = {
	/*
		API Name: register
	*/
	DECODE: async function(req, callback) {
		//send data
		var sendData = {
			ReturnCode : 200,
			err : 0,
			Data : {},
			ReturnMsg : ""
		};
		if (!req.headers['authorization']) {
			sendData['ReturnCode'] = 406;
			sendData['ReturnMsg'] = 'No access token provided';
		    callback(sendData);
		} else {
			try {
				const accessToken = req.headers.authorization.split(' ')[1];
				const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				today = dd + '-' + mm + '-' + yyyy;

			var condition = {
				user_id: decoded._id,
				token: accessToken
			}
			var userData = await logintokenModal.find(condition);
			if(userData.length > 0) {
				console.log("decod??",decoded)
				if(typeof decoded._id != "undefined") {
				
					//avtive users condition
					const activecondition = {
						user_id : mongoose.mongo.ObjectId(decoded._id.toString()),
						current_date : today
					};
					var activeusrData = await activeuserModal.find(activecondition);
					console.log("activeusrData??",activeusrData)
					if(activeusrData.length > 0) {
						activeusrData = activeusrData[0]
						
						// activeuser condition
						const activecountcondition = {
							user_id: mongoose.mongo.ObjectId(decoded._id.toString()),
							current_date: today
						};
						const updateapi = {
							api: 1
						};
						const countData = await activeuserModal.updateOne(activecountcondition, { $inc: updateapi });
					} else {
						//create new record for active user
						const newcount = {
							user_id : mongoose.mongo.ObjectId(decoded._id.toString()),
							current_date : today,
							api : 1
						}
						const newcountData = await activeuserModal.create(newcount);
					}
					sendData['ReturnCode'] = 200;
					sendData['Data'] = decoded;
					callback(sendData);
				} else {
					sendData['ReturnCode'] = 406;
					sendData['ReturnMsg'] = 'Access token invalid';
					callback(sendData);
				}
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Token expired";
				callback(sendData);
			}
			} catch (error) {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Invalid Authorization Token";
				callback(sendData);
			}
		}
	}
}
