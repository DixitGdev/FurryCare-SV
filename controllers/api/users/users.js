//usersModal imported
const usersModal = require('../../../models/users/users');
const signupotpModal = require('../../../models/users/sign-up-otp');
const otpVerificationModal = require('../../../models/users/otp_verification');
const logintokenModal = require('../../../models/users/logintoken');

module.exports = {
	/*
	 *	Function: REGISTER
	 *	@Params: 
	 * 		- mobile_number
	 * 		- password
	**/
	REGISTER: async function (data, callback) {
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};
		//get data into variable
		const email = data.email
		const mobile_number = data.mobile_number;
		const otp = data.otp
		const country_code = data.country_code;
		const fcm_token = (typeof data.fcm_token != "undefined" && data.fcm_token != "")?data.fcm_token:'';
		const platform = (typeof data.platform != "undefined" && data.platform != "")?data.platform:'';
		//condition
		var condition = {
			email: email,
			email_verify:true
		};
		const usersData = await usersModal.find(condition);

		if (usersData.length > 0) {
			sendData['ReturnCode'] = 403;
			sendData['err'] = 1;
			sendData['ReturnMsg'] = "Email already exists";
			callback(sendData);
		} else {
			// condition for verify user
			const verifycondition = {
				email: email,
				otp: otp.toString()
			}
			const otpData = await signupotpModal.find(verifycondition);
			if (otpData.length > 0) {

				await signupotpModal.deleteOne(verifycondition);

				//convert password into encripted format
				data.password = md5(data.password);

				//email-verify
				data.email_verify = true;

				//insert into database
				const respData = await usersModal.create(data);

				//login history
				loginHistoryController.__saveLoginHistory(respData);

				//generate token for user
				var payload = {
					_id: respData._id,
					active: respData.active,
					block: respData.block
				};
				const expireDate = new Date(new Date().setHours(new Date().getHours() + 24));
				const z = {
					Y: expireDate.getFullYear(),
					M: expireDate.getMonth() + 1,
					d: expireDate.getDate(),
					h: expireDate.getHours(),
					m: expireDate.getMinutes(),
					s: expireDate.getSeconds()
				};

				//give response
				sendData['Data'] = {
					ReturnMsg: "You Registered Successfully!",
					Token: jwt.sign(payload, process.env.SECRET_KEY),
					TokenType: "Bearer",
					TokenExpire: z.Y + "-" + ((z.M > 9) ? z.M : '0' + z.M) + "-" + ((z.d > 9) ? z.d : '0' + z.d) + " " + ((z.h > 9) ? z.h : '0' + z.h) + ":" + ((z.m > 9) ? z.m : '0' + z.m) + ":" + ((z.s > 9) ? z.s : '0' + z.s),
					user_id: respData._id,
					pre_screen: PRE_SCREEN,
				};
				var savedata = {
					user_id : mongoose.mongo.ObjectId(respData._id ),
					token: sendData['Data'].Token,
					fcm_token: fcm_token,
					platform: platform
				}
				var updateloginToken = await logintokenModal.create(savedata);
				sendData['Data']['token_id'] = updateloginToken._id;
				callback(sendData);
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Invalid otp";	
				callback(sendData);
			}
		}
	},
	/*
	 * Function: SEND VERIFICATION EMAIL OTP
	 * Description: send verification email to users
	**/
	SEND_EMAIL_OTP: async function (data, callback) {
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};

		//get data into variable
		const email = data.email;

		const condition = {
			email: email,
			email_verify:true
		}
		//find record 
		var userResp = await usersModal.find(condition);
		if(userResp.length > 0){
			sendData['ReturnCode'] = 403;
			sendData['err'] = 1;
			sendData['ReturnMsg'] = "Email already exists";
			callback(sendData);
		}else{
				var createData = {
				email:email,
				otp: commonController.getRandomNumber(4)
			}
			const enterData = await signupotpModal.create(createData);
			createData['_id'] = enterData._id
				await usersApiController.__generateEmailOTP(createData)
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['ReturnMsg'] = "A One time password has been sent to " + email,
			callback(sendData);
		}
	},

	/*
	 * @Generate email OTP
	 * 	- user_id 
	**/
	__generateEmailOTP: async function (data) {
		const user_id = data._id;
		const otp = data.otp
		// const saveData = {
		// 	user_id: mongoose.mongo.ObjectId(user_id.toString()),
		// 	otp:otp
		// };
		// const respData = await otpVerificationModal.create(saveData);

		//send email using SMTP details
		var html =  "<p>Hey,</p><p>Welcome to <strong>Doggers!</strong></p><p>To get started, we need a few things from you. Please confirm your email address so our team knows where they should notifications.</p><p>Your one time password to verify your mail is <strong>"+otp+"</strong></p><p>To your continued success,</p><strong>Team Doggers!</strong>";
		var to = data.email;
		var subject = 'Doggers email verification';
		commonController.__sendEmail(to, subject, html);
	},
	/*
	 * Function: LOGIN
	 * @Params 
	 * 	- header - token
	**/
	LOGIN: async function (data, callback) {
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};

		// //define all variable
		// const userData = data.userData;
    	// const user_id = data.userData._id;

		const fcm_token = (typeof data.fcm_token != "undefined" && data.fcm_token != "")?data.fcm_token:'';
		const platform = (typeof data.platform != "undefined" && data.platform != "")?data.platform:'';

		//condition
		const condition = {
			country_code: data.country_code,
			mobile_number: data.mobile_number,
			password: md5(data.password),
		};
		var usersData = await usersModal.find(condition);
		if (usersData.length > 0) {
			usersData = usersData[0];
			if (usersData.active == false) {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Your account is not active, please contact to admin.";
				callback(sendData);
			} else if (usersData.block == true) {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Your account is blocked, please contact to admin.";
				callback(sendData);
			} else if (usersData.mobile_verify == false && usersData.email_verify == false) {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "You must need to verify your mobile number or email address.";
				callback(sendData);
			} else {
				sendData['ReturnMsg'] = "You are successfully login in your account."
				var payload = {
					_id: usersData._id,
					active: usersData.active,
					block: usersData.block
				};
				const expireDate = new Date(new Date().setHours(new Date().getHours() + 24));
				const z = {
					Y: expireDate.getFullYear(),
					M: expireDate.getMonth() + 1,
					d: expireDate.getDate(),
					h: expireDate.getHours(),
					m: expireDate.getMinutes(),
					s: expireDate.getSeconds()
				};

				//get record for profile

				//condition
				var condition1 = {
					_id: mongoose.mongo.ObjectId(usersData._id.toString()),
				};
				var userResp = await usersModal.find(condition1);

				//check user modal has data or not
				if(userResp.length > 0) {
					var userResp = userResp[0];

					//condition
					var userCondition = {
						user_id: mongoose.mongo.ObjectId(usersData._id.toString()),
					  };

					  //get profile record
      					var ignoreFields = {
       					_id: 0,
        				user_id: 0,
        				created_at: 0,
        				updated_at: 0,
      				};
					  const userProfileCondition = {
						user_id: mongoose.mongo.ObjectId(usersData._id.toString()),
						profile_type: 0,
					  };
					  var userProfileResp = await profileModal.find(
						userProfileCondition,
						ignoreFields,
					  );
						console.log("userProfileResp>>",userProfileResp);
					if(userProfileResp.length > 0) {
						userProfileResp = userProfileResp[0];
						if(typeof userProfileResp.community_id != 'undefined' &&userProfileResp.community_id != '') {
							var condition2 = {
								_id: mongoose.mongo.ObjectId(userProfileResp.community_id.toString())
							}
						} else {
							userProfileResp.community_name = '';
						}
						var communityData = await communityModal.find(condition2);

						if(communityData.length > 0) {
							communityData = communityData[0];
           	 				userProfileResp.community_name = communityData.name;
            				console.log(userProfileResp);
						} else {
							userProfileResp.community_name = '';
						}
					}
				} else {
					userProfileResp = {
						community_name: '',
					  };
				}

				//get location record condition
				const homelocationcondition = {
					user_id: mongoose.mongo.ObjectId(usersData._id.toString()),
					type: 'Home',
				  };
				  const userLocationResp = await userLocationModal.find(
					homelocationcondition,
					ignoreFields,
				  );

				//get education record
				const userEducationResp = await userEducationModal.find(
					userCondition,
					ignoreFields,
				  );

				//get profession record
				const userProfessionalResp = await userProfessionalModal.find(
					userCondition,
					ignoreFields,
				  );

				//get influence power record
				var powercondition = {
					user_id: mongoose.mongo.ObjectId(usersData._id.toString()),
					profile_type: 0,
				  };
				  const powerData = await profileModal.findOne(powercondition, {
					power: 1,
					_id: 0,
				  });

				//get community_invitation record
				var invitecondition = {
					user_id: mongoose.mongo.ObjectId(usersData._id.toString()),
					status: true,
				  };
				  const invitationResp = await communityInvitationModal.find(
					invitecondition,
				  );
				  
				//get following record
				const mycodition = {
		            user_id: mongoose.mongo.ObjectId(usersData._id.toString()),
		            type : 3
		        };
		        const mycommunityData = await communityMemberModal.find(mycodition);
		         getcommunity_id = _.map(mycommunityData, function(obj) {return obj.community_id});

		        var followingcondition = [
		          { $match: { community_id: {$in:getcommunity_id}, user_id:{$ne:mongoose.mongo.ObjectId(usersData._id.toString())} } },
		          {
		                $lookup: {
		                    "from": "community",
		                    "localField": "community_id",
		                    "foreignField": "_id",
		                    "as": "community"
		                }
		            },
		            { $unwind: "$community" },
		            { $match: {"community.delete":0},},
		          {
		            $group: {
		              _id: '',
		              count: { $sum: 1 },
		            },
		          },
		          {
		            $project: {
		              count: '$count',
		            },
		          },
		        ];
		        var followerData = await communityMemberModal.aggregate(followingcondition);
		        if (followerData.length > 0) {
		          followerData = followerData[0];
		          followerData = followerData.count;
		        } else {
		          followerData = 0;
		        }

				//get followed record
				var followedcon = [
		          { $match: { user_id: mongoose.mongo.ObjectId(usersData._id.toString()) } },
		          {
		            $lookup: {
		              from: 'community',
		              localField: 'community_id',
		              foreignField: '_id',
		              as: 'community',
		            },
		          },
		          { $unwind: '$community' },
		          {
		            $group: {
		              _id: '',
		              count: { $sum: 1 },
		            },
		          },
		          {
		            $project: {
		              count: '$count',
		            },
		          },
		        ];
		        var followingData = await followmodal.aggregate(followedcon);
		        if (followingData.length > 0) {
		          followingData = followingData[0];
		          followingData = followingData.count;
		        } else {
		          followingData = 0;
		        }

				//verification record
				const verifycondition = [
					{ $match: { user_id: mongoose.mongo.ObjectId(usersData._id.toString()) } },
					{ $group: { _id: '$type', count: { $sum: 1 } } },
					{ $project: { count: '$count' } },
				  ];
				  const userDetailsVerification =
					await usersDetailsVerificationModal.aggregate(verifycondition);
		  
				  var verificationData = {
					location: 0,
					community: 0,
					name: 0,
					age: 0,
					gender: 0,
				  };
				  var verificationRating = 0;

				  for (var i = 0; i <= userDetailsVerification.length; i++) {
					if (i == userDetailsVerification.length) {
					  const respData = {
						country_code: userResp.country_code,
						mobile_number: userResp.mobile_number,
						email: userResp.email,
						active: userResp.active,
						block: userResp.block,
						mobile_verify: userResp.mobile_verify,
						email_verify: userResp.email_verify,
						profile: {
						  profile_type: userProfileResp.profile_type,
						  profile_pic: userProfileResp.profile_pic,
						  cover_pic: userProfileResp.cover_pic,
						  name: userProfileResp.name,
						  age: userProfileResp.age,
						  gender: userProfileResp.gender,
						  about_me: userProfileResp.about_me,
						  tagline: userProfileResp.tagline,
						  community_id:
							typeof userProfileResp.community_id != 'undefined' &&
							userProfileResp.community_id != ''
							  ? userProfileResp.community_id
							  : '',
						  community_name: userProfileResp.community_name,
						  location:
							userLocationResp[0].type == 'Home'
							  ? userLocationResp[0].text
							  : userLocationResp[0].text,
						},
						warn: userResp.reported >= 10 ? true : false,
						location: userLocationResp,
						education: userEducationResp,
						profession: userProfessionalResp,
						power: powerData.power,
						invitation: invitationResp.length,
						following: followingData,
						follower: followerData,
						verification: verificationData,
						verificationRating: verificationRating,
						config:{
							vemtas_member_limit : config.community.member_lock_limit_vamtas,
							candid_member_limit : config.community.member_lock_limit_candid
						}
					  };
					  sendData['Data'] = {
							pre_screen: PRE_SCREEN,
							user_id: usersData._id,
							Token: jwt.sign(payload, process.env.SECRET_KEY),
							TokenType: "Bearer",
							TokenExpire: z.Y + "-" + ((z.M > 9) ? z.M : '0' + z.M) + "-" + ((z.d > 9) ? z.d : '0' + z.d) + " " + ((z.h > 9) ? z.h : '0' + z.h) + ":" + ((z.m > 9) ? z.m : '0' + z.m) + ":" + ((z.s > 9) ? z.s : '0' + z.s),
							profile:respData
						};
						var savedata = {
							user_id : mongoose.mongo.ObjectId(usersData._id ),
							token:sendData['Data'].Token,
							fcm_token: fcm_token,
							platform: platform
						}
						var updateloginToken = await logintokenModal.create(savedata);
						sendData['Data']['token_id'] = updateloginToken._id;
						usersApiController.CHECK_PROFILE({ userData: usersData }, function (respData) {
							if (sendData['err'] == 0) {
								sendData['Data']['check_status'] = respData['Data'];
								callback(sendData);
							} else {
								callback(sendData);
							}
						});
					} else {
					  verificationData[userDetailsVerification[i]._id] =
						userDetailsVerification[i].count;
					  verificationRating =
						verificationRating + (userDetailsVerification[i].count >= 9)
						  ? 1
						  : 0;
					}
				  }
			}
		} else {
			sendData['ReturnCode'] = 403;
			sendData['err'] = 1;
			sendData['ReturnMsg'] = "Mobile number and password doesn't match.";
			callback(sendData)
		}
	},
	/*
	 * Function: LOGOUT
	 * @Params 
	 * 	- header - token
	**/
	LOGOUT: async function (data, callback) {
		//send data
		var sendData = {
			ReturnCode : 200,
			err : 0,
			Data : {},
			ReturnMsg : ""
		};

		//define all variable
		var userData = data.userData;
		var token = data.token.replace('Bearer ', '');
		console.log("userData>>",userData);
		//condition for user login or not
		const userlogincondition = {
			user_id:mongoose.mongo.ObjectId(userData._id.toString()),
			token:token
		};
		console.log("userlogincondition>>",userlogincondition);
		var loginData = await logintokenModal.find(userlogincondition);
		console.log("loginData>>",loginData);
		if(loginData.length > 0) {
			loginData=loginData[0]

			const updateData = await logintokenModal.deleteOne(userlogincondition);
			sendData['ReturnCode'] = 200;
			sendData['err'] = 0;
			sendData['ReturnMsg'] = "User logout successfully!";
			callback(sendData);
		} else {
			sendData['ReturnCode'] = 403;
			sendData['err'] = 1;
			sendData['ReturnMsg'] = "User Not Login";
			callback(sendData);
		}
	},

	/*
	 * Function: CHANGE_PASSWORD
	 * @params
	 * 	- old_password
	 * 	- new_password
	 * 	- confirm_password
	**/
	CHANGE_PASSWORD: async function (data, callback) {
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};
		//get user data into variable
		var userData = data.userData;
		var old_password = data.old_password;
		var new_password = data.new_password;
		var confirm_password = data.confirm_password;

		//condition
		const condition = {
			_id: mongoose.mongo.ObjectId(userData._id.toString())
		};
		var usersData = await usersModal.find(condition);

		//check user modal has data or not
		if (usersData.length > 0) {
			usersData = usersData[0];

			if (usersData.password !== md5(old_password)) {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Your old password is not match with your account."
				callback(sendData);
			} else if (new_password !== confirm_password) {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "Password dosn't match with confirm password."
				callback(sendData);
			} else {
				const condition = {
					_id: mongoose.mongo.ObjectId(userData._id.toString())
				};
				const updateData = {
					password: md5(new_password)
				};
				//update data into user profile
				const respData = await usersModal.updateOne(condition, updateData);

				sendData['ReturnCode'] = 200;
				sendData['err'] = 0;
				sendData['ReturnMsg'] = "New password is successfully set with your account."
				callback(sendData);
			}
		} else {
			sendData['ReturnCode'] = 403;
			sendData['err'] = 1;
			sendData['ReturnMsg'] = "User not login!"
			callback(sendData)
		}
	},

	/*
	 * Function: FORGOT_PASSWORD
	 * @params
	 * 	- email
	**/
	FORGOT_PASSWORD: async function (data, callback) {
		console.log("data >>", data);
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: "",
		};
		//define variable
		const type = data.type
		const country_code = data.country_code;
		if (type == 1) {
			//get user data into variable
			var email = data.email;
			//condition for find email
			var condition = {
				email: email
			};
			var usersData = await usersModal.find(condition);

			
			console.log("data >>", usersData);
			if (usersData.length > 0) {
				sendData['ReturnCode'] = 200;
				sendData['err'] = 0;
				await usersApiController.__generateFORGOTPASSWORDOTP(data);
				sendData['ReturnMsg'] = "send otp on your email."
				callback(sendData)
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "your email is not valid"
				callback(sendData)
			}
		} if (type == 0) {
			//get data into variable
			var mobile_number = data.mobile_number;

			//condition for find mobile_number
			var condition = {
				mobile_number: mobile_number,
				country_code : country_code
			};
			var usersData = await usersModal.find(condition);
			console.log("data >>", usersData);
			if (usersData.length > 0) {
				sendData['ReturnCode'] = 200;
				sendData['err'] = 0;
				await usersApiController.__generateFORGOTPASSWORDOTP_MOBILE(data);
				sendData['ReturnMsg'] = "send otp on your mobile."
				callback(sendData)
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "your mobile is not valid or country_code required"
				callback(sendData);
			}
		}
	},
	/*
	 * @Generate_FORGOTPASSWORD_OTP
		* 	- email
	**/
	__generateFORGOTPASSWORDOTP: async function (data) {
		const email = data.email;
		const saveData = {
			email: email,
			type: "Email",
			otp: commonController.getRandomNumber(6)
			// otp: "123456"
		};
		const respData = await forgotPasswordModal.create(saveData);

		//send email using SMTP details
		var html =  "<p>Hey,</p><p>Your password reset One-time password for <strong>Lyfstori!</strong></p><p>To get started, we need a few things from you. Please confirm your email address so our team knows where they should notifications.</p><p>Your one time password to verify your mail is <strong>"+saveData.otp+"</strong></p><p>To your continued success,</p><strong>Team Lyfstori!</strong>";
		var to = data.email;
		var subject = 'Lyfstori Reset One-time Password';
		commonController.__sendEmail(to, subject, html);
	},
	/*
	 * @Generate_FORGOTPASSWORD_OTP
		* 	- mobile_number
	**/
	__generateFORGOTPASSWORDOTP_MOBILE: async function (data) {
		const mobile_number = data.mobile_number;
		const country_code = data.country_code
		const saveData = {
			mobile_number: mobile_number,
			country_code:country_code,
			type: "mobile_number",
			otp: commonController.getRandomNumber(6)
			// otp: "123456"
		};
		const respData = await forgotPasswordModal.create(saveData);
		var sendMessageData = {
			mobile: ''+saveData.country_code+saveData.mobile_number,
			message: "Your Lyfstori one-time password for verifying your account is "+saveData.otp
		};
		notificationController.__sendMessage(sendMessageData);


	},

	/*
	* @VERIFY_FORGOT_PASSWORD
	*  - email
	**/
	VERIFY_FORGOT_PASSWORD: async function (data, callback) {
		console.log("data>>",data);
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};
		//define variable 
		const type = data.type
		const country_code = data.country_code
		
		if (type == 1) {
			//get user data into variable
			var email = data.email;
			var otp = data.otp;

			//condition
			var condition = {
				email: email,
				otp: otp
			};
			var usersData = await forgotPasswordModal.find(condition)
			console.log("data >>", usersData);
			if (usersData.length > 0) {
				sendData['ReturnCode'] = 200;
				sendData['err'] = 0;
				sendData['ReturnMsg'] = "your email and otp verify";
				callback(sendData)
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "your otp not match"
				callback(sendData)
			}
		} if (type == 0) {
			//get user data into variable
			var mobile_number = data.mobile_number;
			var otp = data.otp;

			//condition
			var condition = {
				mobile_number: data.mobile_number,
				country_code: country_code,
				otp: otp.toString()
			};
			var usersData = await forgotPasswordModal.find(condition)
			console.log("data >>", usersData);
			if (usersData.length > 0) {
				sendData['ReturnCode'] = 200;
				sendData['err'] = 0;
				sendData['ReturnMsg'] = "your number and otp verify";
				callback(sendData)
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "your otp not match"
				callback(sendData)
			}
		}
	},

	/*
	* @RESET_FORGOT_PASSWORD
	*  - email
	*  - otp
	*  - new password
	**/
	RESET_FORGOT_PASSWORD: async function (data, callback) {
		//send data
		var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};
		//define variable
		const type = data.type
		if (type == 1) {
			//get data into variable
			const otp = data.otp
			const email = data.email
			const password = md5(data.password)

			var otpCondition = {
				email: data.email,
				otp : otp
			};

			var otpData = await forgotPasswordModal.find(otpCondition);
			console.log("otp >>", otpData);
			if (otpData.length > 0) {
				otpData = otpData[0];

				if (otpData.otp === otp) {
					//condition
					var condition = {
						email: email
					};

					var userResp = await usersModal.find(condition)

					if (userResp.length > 0) {
						//update into database
						const userCondition = {
							email: email
						};

						const updateData = {
							password: password
						};
						const respData = await usersModal.updateOne(userCondition, updateData);

						//remove otp record from database 
						await forgotPasswordModal.deleteOne(otpCondition);

						sendData['ReturnCode'] = 200;
						sendData['err'] = 0;
						sendData['ReturnMsg'] = "your forgot password reset"
						callback(sendData)
					} else {
						sendData['ReturnCode'] = 403;
						sendData['err'] = 1;
						sendData['ReturnMsg'] = "user not  found in database";
						callback(sendData)
					}
				} else {
					sendData['ReturnCode'] = 403;
					sendData['err'] = 1;
					sendData['ReturnMsg'] = "otp not match";
					callback(sendData)
				}
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "otp invalid or expired";
				callback(sendData)
			}
		} if (type == 0) {
			//get data into variable
			const otp = data.otp.toString()
			const mobile_number = data.mobile_number
			const country_code = data.country_code
			const password = md5(data.password)

			var otpCondition = {
				mobile_number: mobile_number,
				country_code: country_code,
				otp : otp
			};

			var otpData = await forgotPasswordModal.find(otpCondition);
			console.log("otpData >>", otpData);
			if (otpData.length > 0) {
				otpData = otpData[0];

				if (otpData.otp === otp) {
					//condition
					var condition = {
						mobile_number: mobile_number,
						country_code: country_code
					};

					var userResp = await usersModal.find(condition)

					if (userResp.length > 0) {
						//update into database
						const userCondition = {
							mobile_number: mobile_number
						};

						const updateData = {
							password: password
						};
						const respData = await usersModal.updateOne(userCondition, updateData);

						//remove otp record from database 
						await forgotPasswordModal.deleteOne(otpCondition);

						sendData['ReturnCode'] = 200;
						sendData['err'] = 0;
						sendData['ReturnMsg'] = "your forgot password reset"
						callback(sendData)
					} else {
						sendData['ReturnCode'] = 403;
						sendData['err'] = 1;
						sendData['ReturnMsg'] = "user not  found in database";
						callback(sendData)
					}
				} else {
					sendData['ReturnCode'] = 403;
					sendData['err'] = 1;
					sendData['ReturnMsg'] = "otp not match";
					callback(sendData)
				}
			} else {
				sendData['ReturnCode'] = 403;
				sendData['err'] = 1;
				sendData['ReturnMsg'] = "otp invalid or expired";
				callback(sendData)
			}
		}
	}
}
