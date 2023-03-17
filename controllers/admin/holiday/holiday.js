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
      let respData = await holidayModel.updateOne(condition, updateData);
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
    var respData = await holidayModel.create(saveData);

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
    var search = data.search;

    //condition
    var condition = {
      deleted: false,
    };

    var aggre = [
      {
        $match: {
          deleted: false,
        },
      },
      {
        $addFields: {
          s_date: {
            $dateFromString: {
              dateString: "$date",
              format:
                "%Y-%m-%d" ,
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          _id: 1,
          date: { $dateToString: { format: "%d-%m-%Y", date: "$s_date" } },
          year: 1,
          active: 1,
          status: {
            $cond: {
              if: { $eq: ["$active", true] },
              then: "Active",
              else: "Deactive",
            },
          },
        },
      },
    ];

    if (search == "") {
      var numRows = await holidayModel.find(condition).count();
      var professionTypeData = await holidayModel
        .aggregate(aggre)
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
    } else {
      var condition_search = {
        title: { $regex: search, $options: "i" },
        deleted: false,
      };
      var numRows = await holidayModel.find(condition_search).count();
      var professionTypeData = await holidayModel
        .aggregate([
          {
            $match: {
              title: { $regex: search, $options: "i" },
            },
          },
          ...aggre,
        ])
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
    var recordData = await holidayModel.find(condition);
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
      var respData = await holidayModel.updateOne(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Holiday removed from database";
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
