const districtModel = require("../../../models/location/district");
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
      city_id: data.city_id ? data.city_id : "",
    };
    var numRows = await districtModel.find(condition).count();
    var professionTypeData = await districtModel
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
    var recordData = await districtModel.find(condition);
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
  //listAll district
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
      city_id: data.city_id ? data.city_id : "IN",
    };
    var respData = await districtModel.find(condition)
    sendData["data"] = respData;
    callback(sendData);
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
        city_id: mongoose.mongo.ObjectId(data.city_id.toString()),
        name: data.name,
        pin_code: data.pin_code,
      };
      let respData = await districtModel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "District data updated";
      callback(sendData);
    } else {
      //if we have id then it's edit
      var saveData = {
        city_id: mongoose.mongo.ObjectId(data.city_id.toString()),
        name: data.name,
        pin_code: data.pin_code,
        created_at: new Date(),
      };
      var respData = await districtModel.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New district added";
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
      var respData = await districtModel.deleteMany(condition);
      sendData["data"] = respData;
      sendData["msg"] = "District removed";
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
