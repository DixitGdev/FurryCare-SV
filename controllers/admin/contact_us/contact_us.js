const contact_us_model = require("../../../models/contact_us/contact_us");


module.exports={
    LIST: async function (data, callback) {
        //send data
        var sendData = {
          status: 200,
          err: 0,
          data: {},
          msg: "",
        };
        var start = parseInt(data.start);
        var limit = parseInt(data.limit);
        var search = data.search;
    
    
          var numRows = await contact_us_model.find().count();
          var professionTypeData = await contact_us_model
            .find()
            .skip((start - 1) * limit)
            .limit(limit);
          var respData = commonController.paginationSetup(
            start,
            limit,
            numRows,
            professionTypeData.length
          );

          if(professionTypeData){
            respData.list = professionTypeData;
            sendData["data"] = respData;
            callback(sendData);
          }
        
      },

      VIEW: async function (data, callback) {
        //send data
        var sendData = {
          status: 200,
          err: 0,
          data: {},
          msg: "",
        };
        var id = data.id;
    
        //condition
        var condition = {
          _id: mongoose.mongo.ObjectId(id),
        };
        var recordData = await contact_us_model.find(condition);
        if (recordData.length > 0) {
          recordData = recordData[0];
          sendData["data"] = recordData;
          callback(sendData);
        } else {
          sendData["status"] = 406;
          sendData["err"] = 1;
          sendData["data"] = {};
          sendData["msg"] = "No record found.";
          callback(sendData);
        }
      },
    
    
}