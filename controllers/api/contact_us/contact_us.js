const contact_us_model= require('../../../models/contact_us/contact_us')
module.exports ={

    SAVE: async function(data,callback){

        var sendData = {
			ReturnCode: 200,
			err: 0,
			Data: {},
			ReturnMsg: ""
		};

        var email=data.email;
        var mobile_number= data.mobile_number;
        var name= data.name;
        var subject= data.subject;
        var message= data.message;
        var names= "da"

        var savedata={
       name,
            subject,
            email,
            mobile_number,
            message
        }
         
        var respData = await contact_us_model.create(savedata);
        sendData.Data=respData,
        sendData.ReturnMsg= "Data added successfully"
        callback(sendData);

    }
}