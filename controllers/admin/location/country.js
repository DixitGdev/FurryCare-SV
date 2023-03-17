const countryModel = require("../../../models/location/country");
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
      deleted: false,
    };
    var numRows = await countryModel.find(condition).count();
    var professionTypeData = await countryModel
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
  //listAll country
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
      deleted: false,
    };
    var AllData = await countryModel.find(condition)
    sendData["data"] = AllData;
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
    var recordData = await countryModel.find(condition);
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
        code: data.code,
      };
      let respData = await countryModel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Country data updated";
      callback(sendData);
    } else {
      //if we have id then it's edit
      var saveData = {
        name: data.name,
        country_code: data.country_code,
        code: data.code,
        createdAt: new Date(),
      };
      var respData = await countryModel.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New country added";
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
      var respData = await countryModel.deleteMany(condition);
      sendData["data"] = respData;
      sendData["msg"] = "Country removed";
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
