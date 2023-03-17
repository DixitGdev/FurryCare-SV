const e = require("cors");
const groomer_wallet_historymodel = require("../../../models/groomer_wallet_history/groomer_wallet_history");
const holidayModel = require("../../../models/holiday/holiday");


module.exports = {
    SAVE: async function (data, callback) {
      //send data
      var sendData = {
        status: 200,
        err: 0,
        data: {},
        msg: "",
      };
      var id = data.id;
      var active = data.active;
      if (active == "true") {
        active = true;
      } else {
        active = false;
      }
  
      //edit
      if (id != "") {
        var condition = {
          _id: mongoose.mongo.ObjectId(id.toString()),
        };
        var updateData = {
          title:data.title,
          year:data.year,
          active:active,
          date: data.date,
        };
        let respData = await groomer_wallet_historymodel.updateOne(condition, updateData);
        sendData["data"] = respData;
        sendData["msg"] = "Profession data updated in white list";
        callback(sendData);
      } 
      
      //create
      else {
      
      var saveData = {
        title: data.title,
        year: data.year,
        date: data.date,
        active: data.active,
       
      };
      console.log("savedata", saveData);
      var respData = await groomer_wallet_historymodel.create(saveData);
  
      sendData["data"] = respData;
      sendData["msg"] = "New profession added in white list";
      callback(sendData);
    }
  },

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
    var id = data.id;
      console.log("id",id)
    //condition
    var condition = {
      groomer_id: mongoose.mongo.ObjectId(id.toString())   
     };

    var aggre = [
      {
        $match: {
          groomer_id: mongoose.mongo.ObjectId(id.toString()),
        },
      },
      {
        $project: {
          description: 1,
          groomer_id:1,
          _id: 1,
          date:1,
          date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } },
          amount:1,
          created_at:1,
          final_amount:1
        },
      },
      {
        $sort: { created_at: -1 },
      },

    ];

 
      var numRows = await groomer_wallet_historymodel.find(condition).count();
      
      var professionTypeData = await groomer_wallet_historymodel
        .aggregate(aggre)
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
      else{
        sendData["status"] = 406;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found.";
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
    var recordData = await groomer_wallet_historymodel.find(condition);
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

  DELETE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    var id = data.id;

    if (id != "") {
      //if id is empty then make new insert
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updateData = {
        deleted: true,
      };
      var respData = await groomer_wallet_historymodel.updateOne(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Data removed from database";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },




}