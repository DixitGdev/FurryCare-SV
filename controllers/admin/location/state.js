const stateModel = require("../../../models/location/states");
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
      country_code: data.country_code ? data.country_code : "IN",
    };
    var numRows = await stateModel.find(condition).count();
    var professionTypeData = await stateModel
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
      country_code: data.country_code ? data.country_code : "IN",
    };
    var respData = await stateModel.find(condition);
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
    var recordData = await stateModel.find(condition);
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
        name: data.name,
        country_code: data.country_code,
      };
      let respData = await stateModel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "State data updated";
      callback(sendData);
    } else {
      //if we have id then it's edit
      var saveData = {
        name: data.name,
        country_code: data.country_code,
        created_at: new Date(),
      };
      var respData = await stateModel.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New state added";
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
      var respData = await stateModel.deleteMany(condition);
      sendData["data"] = respData;
      sendData["msg"] = "State removed";
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
