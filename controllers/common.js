module.exports = {
	//socketio - send data function
	sendData: function(en, data, status, sd) {
		if(typeof sd == 'undefined' || sd == '' || sd == null || sd == 0 ) return false;
		
		var sendData = {
			data:data,
			en:en,
			status:status
		};
		if(typeof clients != "undefined" && typeof clients[sd] != "undefined") {
			clients[sd].emit('res',sendData);
		} else {
	      	io.to(sd).emit("res", sendData);
	    }
	},
	//socketio - send data in to room
	sendDatatoTable: function(en, data, status, sd) {
		if(typeof sd == 'undefined' || sd == '' || sd == null || sd == 0 ) return false;

		var sendData = {
			data:data,
			en:en,
			status:status
		};
		io.to(sd).emit("res", sendData);
	},
	//send data to all
	sendDataToAll: function(en, data, status) {
			
		var sendData = {
			data:data,
			en:en,
			status:status
		};
		//io.to(sd).emit('res',sendData);
		io.emit("res", sendData);
	},
	errorValidationResponse: function(data) {
		var message = '';
		data.errors.forEach(function(error){
            message +=  '\'' + error.param + '\' has ' + error.msg +' in '+error.location+'. ';
        });
		var sendData = {
			ReturnCode : 406,
			err : 1,
			Data : data,
			ReturnMsg : message
		};
		return sendData;
		// var sendData = {
		// 	ReturnCode : 406,
		// 	err : 1,
		// 	Data : data,
		// 	ReturnMsg : ''
		// };
		// return sendData;
	},
	GetTimeDifference : function(startDate, endDate, type){
		  	var date1 = new Date(startDate);
			var date2 = new Date(endDate);
			var diffMs = (date2 - date1);
			
			if(type == 'day')
			{
				var timeDiff = Math.abs(date2.getTime() - date1.getTime());
				var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
				return diffDays;
			}
			else if(type == 'hour')
				return Math.round((diffMs % 86400000) / 3600000); 
			else if(type == 'minute')	
				return Math.round(((diffMs % 86400000) % 3600000) / 60000);
			else
			 	return Math.round((diffMs / 1000));	
	},
	getRandomNumber: function(length) {
		var text = "";
		var possible = "0123456789";
		for(var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
			return text;
	},
	getRandomCode: function(length) {
		var text = "";
		var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		for(var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
	chunkArray: function(myArray, chunk_size) {
		var index = 0;
	    var arrayLength = myArray.length;
	    var tempArray = [];
	    
	    for (index = 0; index < arrayLength; index += chunk_size) {
	        myChunk = myArray.slice(index, index+chunk_size);
	        // Do something if you want with the group
	        tempArray.push(myChunk);
	    }

	    return tempArray;
	},
	shuffle: function(array) {
	  	var currentIndex = array.length, temporaryValue, randomIndex;

	  	// While there remain elements to shuffle...
	  	while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
	  	}
	  	return array;
	},
	inArray: function(haystack, needle) {
	    var length = haystack.length;
	    for(var i = 0; i < length; i++) {
	        if(haystack[i] == needle) return true;
	    }
	    return false;
	},
	paginationSetup: function(start, limit, numRows, currentRows, type = '') {
		var paginator = new pagination.SearchPaginator({prelink:'/', current: start, rowsPerPage: limit, totalResult: numRows});
		var paginationData = paginator.getPaginationData();

		if(type == "") {
			var html = '';
			if(paginationData.previous != null) {
				html += '<li class="page-item previous"><a href="#" onclick="pagination('+paginationData.previous+');" class="page-link"><i class="previous"></i></a></li>';
			}
			for(var i = 0; i < paginationData.range.length; i++) {
				html += '<li class="page-item '+((paginationData.current == paginationData.range[i])?'active':'')+'"><a href="#" onclick="pagination('+paginationData.range[i]+');" class="page-link">'+paginationData.range[i]+'</a></li>';
			}
			if(paginationData.next != null) {
				html += '<li class="page-item previous"><a href="#" onclick="pagination('+paginationData.next+');" class="page-link"><i class="next"></i></a></li>';
			}
			var text = "Showing "+(((start-1)*limit)+1)+" to "+(((start-1)*limit)+currentRows)+" of "+numRows+" entries";
			if(numRows == 0) {
				text = "Showing "+0+" to "+0+" of "+numRows+" entries";
			}
			var respData = {
				html: html,
				text: text
			};
			return respData;
		} else {
			var html = '';
			if(paginationData.previous != null) {
				html += '<li class="page-item previous"><a href="#" onclick="pagination('+paginationData.previous+', \''+type+'\');" class="page-link"><i class="previous"></i></a></li>';
			}
			for(var i = 0; i < paginationData.range.length; i++) {
				html += '<li class="page-item '+((paginationData.current == paginationData.range[i])?'active':'')+'"><a href="#" onclick="pagination('+paginationData.range[i]+', \''+type+'\');" class="page-link">'+paginationData.range[i]+'</a></li>';
			}
			if(paginationData.next != null) {
				html += '<li class="page-item previous"><a href="#" onclick="pagination('+paginationData.next+', \''+type+'\');" class="page-link"><i class="next"></i></a></li>';
			}
			var text = "Showing "+(((start-1)*limit)+1)+" to "+(((start-1)*limit)+currentRows)+" of "+numRows+" entries";
			if(numRows == 0) {
				text = "Showing "+0+" to "+0+" of "+numRows+" entries";
			}
			var respData = {
				html: html,
				text: text
			};
			return respData;
		}
	},
	dateFormat: function(date) {
		var today = new Date(date);

		var date1 = today;
		var month = date1.getMonth()+1;
		var day = date1.getDate();
		var hour = date1.getHours();
		var sec = date1.getSeconds();
		var min = date1.getMinutes();
		return date1.getFullYear()+"-"+((month > 9)?month:'0'+month)+"-"+((day > 9)?day:'0'+day)+" "+((hour>9)?hour:'0'+hour)+':'+((min>9)?min:'0'+min)+':'+((sec>9)?sec:'0'+sec);
	},
	__sendEmail: function(receiver_email, email_subject, email_body) {
		let transporter = nodemailer.createTransport({
			host: 'smtp.googlemail.com', // Gmail Host
			port: 465, // Port
			secure: true, // this is true as port is 465
			auth: {
				user: 'dhruvik.codezee@gmail.com',
				pass: 'izrljeqqzffxgygz'
			},
		});

		// send mail with defined transport object
		let info = transporter.sendMail({
			from: '"Doggers" <noreply@lyfstori.com>', // sender address
			to: receiver_email, // list of receivers
			subject: email_subject, // Subject line
			text: "Hello world?", // plain text body
			html: email_body, // html body
		});

		console.log("Message sent: %s", info);
	},

	formatTimeToHHMMSS: function (seconds = 0, isHr = true, isMin = true, isSec = true) {
		seconds = Math.abs(seconds)
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = Math.round(seconds % 60);
		return [
			isHr ? h > 0 ? h < 10 ? '0' + h : h : "00" : "",
			isMin ? m > 0 ? m < 10 ? '0' + m : m : "00" : "",
			isSec ? s > 0 ? s < 10 ? '0' + s : s : "00" : ""
		].filter(Boolean).join(':');
	},

	__sendEmail2: async function(receiver_email, reply, email_body,callback) {
		var sendData = {
			status: 200,
			err: 0,
			data: {},
			msg: "",
		  };

		let transporter = nodemailer.createTransport({
			// host: 'smtp.googlemail.com', // Gmail Host
			// port: 465, // Port
			// secure: true, // this is true as port is 465
			service: 'gmail',
			auth: {
				user: 'dhruvik.codezee@gmail.com',
				pass: 'izrljeqqzffxgygz'
			},
		});

		// send mail with defined transport object
		let info =  await transporter.sendMail({
			from: 'dhruvik.codezee@gmail.com', // sender address
			to: receiver_email, // list of receivers
			subject: "reply of Doggers", // Subject line
			text: reply, // plain text body
			//html: email_body, // html body
		});
		sendData.msg="Email sent SuccessFully to "+receiver_email
		callback(sendData)
		console.log("Message sent: %s", info);
	},

}
