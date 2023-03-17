const cityModel = require("../../../models/location/city");
module.exports = {
  //list of white list
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

    //condition
    var condition = {
      state_id: data.state_id ? data.state_id : "",
    };
    var numRows = await cityModel.find(condition).count();
    var professionTypeData = await cityModel
      .find(condition)
      .skip((start - 1) * limit)
      .limit(limit);
    var respData = commonController.paginationSetup(
      start,
      limit,
      numRows,
      professionTypeData.length
    );
    respData.list = professionTypeData;
    sendData["data"] = respData;
    callback(sendData);
  },
  LISTALL: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    //condition
    var condition = {
      state_id: data.state_id ? data.state_id : "IN",
    };
    var respData = await cityModel.find(condition)
    sendData["data"] = respData;
    callback(sendData);
  },
  //view
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
    var recordData = await cityModel.find(condition);
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
  //save
  SAVE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    var id = data.id;
    if (id != "") {
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updateData = {
        state_id: mongoose.mongo.ObjectId(data.state_id.toString()),
        name: data.name,
        lat: data.lat,
        long: data.long,
      };
      let respData = await cityModel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "City data updated";
      callback(sendData);
    } else {
      //if we have id then it's edit
      var saveData = {
        state_id: mongoose.mongo.ObjectId(data.state_id.toString()),
        name: data.name,
        lat: data.lat,
        long: data.long,
        created_at: new Date(),
      };
      var respData = await cityModel.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New city added";
      callback(sendData);
    }
  },
  //DELETE
  DELETE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    var id = data.id;
    var userData = data.userData;

    if (id != "") {
      //if id is empty then make new insert
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var respData = await cityModel.deleteMany(condition);
      sendData["data"] = respData;
      sendData["msg"] = "City removed";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },
};
