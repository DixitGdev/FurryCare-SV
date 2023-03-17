const groomers_model = require("../../../models/groomers/groomers");
const groomer_leave_model = require("../../../models/groomer_leave/groomer_leave");

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

    //edit
    if (id != "") {
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updateData = {
        groomer: data.groomer,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        reason: data.reason,
      };
      let respData = await groomer_leave_model.updateOne(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Groomer leave data updated in white list";
      callback(sendData);
    }

    //create
    else {
      var saveData = {
        groomer: data.groomer,
        start_date: data.start_date,
        end_date: data.end_date,
        reason: data.reason,
        status: data.status,
        created_at: new Date(),
      };
      console.log("savedata", saveData);
      var respData = await groomer_leave_model.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New Groomer leave added in white list";
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
        $lookup: {
          from: "groomers",
          localField: "groomer",
          foreignField: "_id",
          as: "groomer_data",
        },
      },
      { $unwind: "$groomer_data" },

      {
        $project: {
          groomern: "$groomer_data.name",
          groomer: 1,
          _id: 1,
          created_at: 1,
          start_date: 1,
          end_date: 1,
          reason: 1,
          status: 1,
        },
      },
      {
        $match: {
          groomern: { $regex: search, $options: "i" },
        },
      },
      {
        $sort: { created_at: -1 },
      },
    ];

    if (search == "") {
      var numRows = await groomer_leave_model.find(condition).count();
      var professionTypeData = await groomer_leave_model
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
      var numRows = await groomer_leave_model.aggregate(aggre);
      var professionTypeData = await groomer_leave_model
        .aggregate(aggre)
        .skip((start - 1) * limit)
        .limit(limit);
      var respData = commonController.paginationSetup(
        start,
        limit,
        numRows.length,
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
    const aggre = [
      {
        $match: {
          deleted: false,
          _id: mongoose.mongo.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "groomers",
          localField: "groomer",
          foreignField: "_id",
          as: "groomer_data",
        },
      },
      { $unwind: "$groomer_data" },
      {
        $project: {
          _id: 1,
          groomer: 1,
          start_date: 1,
          end_date: 1,
          reason: 1,
          status: 1,
          groomername: "$groomer_data.name",
        },
      },
    ];

    var recordData = await groomer_leave_model.aggregate(aggre);
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
      var respData = await groomer_leave_model.updateOne(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Groomer leave removed from database";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },

  LIST_GROOMERS: async function (data, callback) {
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };

    var search = data.search || "";
    console.log("search", search);
    var aggre = [
      {
        $match: {
          active: true,
          deleted: false,
          name: { $regex: search, $options: "-i" },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ];

    var professionTypeData = await groomers_model.aggregate(aggre);
    if (professionTypeData.length > 0) {
      sendData["data"] = professionTypeData;
      sendData["msg"] = "record found";
      callback(sendData);
    } else {
      sendData.err = 1;
      sendData["msg"] = " no record found";
    }
  },
};
