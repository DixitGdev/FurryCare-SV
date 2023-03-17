const { checkSchema } = require("express-validator");
const ObjectId = require("mongoose/lib/types/objectid");
const service_categoryModal = require("../../../models/service_category/service_category");

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
    var name = data.name;

    var checkname = await service_categoryModal.find({
      name: name,
      deleted: false,
    });

    if (id != "") {
      var check_id_name = await service_categoryModal.findOne({
        name: name,
        deleted: false,
        _id: id,
      });

      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updateData = {
        name: data.name,
        icon: data.icon,
        parent_id: data.parent_id ? data.parent_id : null,
      };
      if (check_id_name) {
        let respData = await service_categoryModal.updateOne(
          condition,
          updateData
        );
        sendData["data"] = respData;
        sendData["msg"] = "service category data updated in white list";
        callback(sendData);
      } else if (checkname.length > 0) {
        sendData.err = 1;
        sendData.msg = "you can't save as same name service category";
        callback(sendData);
      } else {
        let respData = await service_categoryModal.updateOne(
          condition,
          updateData
        );
        sendData["data"] = respData;
        sendData["msg"] = "service category data updated in white list";
        callback(sendData);
      }
    } else {
      if (checkname.length > 0) {
        sendData.err = 1;
        sendData.msg = "you can't save as same name service category";
        callback(sendData);
      } else {
        var saveData = {
          name: data.name,
          icon: data.icon,
          parent_id: data.parent_id ? data.parent_id : null,
          created_at: new Date(),
        };
        var respData = await service_categoryModal.create(saveData);

        sendData["data"] = respData;
        sendData["msg"] = "New service category added in white list";
        callback(sendData);
      }
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

    console.log(search, ">>>>>>search");
    //condition
    // var condition = {
    //   deleted: false
    // };
    const aggre = [
      {
        $match: {
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "service_category",
          localField: "parent_id",
          foreignField: "_id",
          as: "branches",
        },
      },
      // {$unwind:"$branches"},
      {   //this is for sort main category 
        $addFields: {
            parentIdId: {
                $concat: [{
                    $ifNull: [{
                        $toString: "$parent_id"
                    }, ""]
                }, {
                    $toString: "$_id"
                }]
            }
        }
    }, 
      {
        $project: {
          name: 1,
          icon: 1,
          parent_name: "$branches.name",
          // parentIdId: 0
          parent_id:1,
          parentIdId: 1

        },
      },
      {
        $sort: {
            parentIdId: 1
        }
    },
    ];

    if (search == "") {
      var numRows = await service_categoryModal
        .find({ deleted: false })
        .count();
      var datalist2 = await service_categoryModal
        .aggregate(aggre)
        .skip((start - 1) * limit)
        .limit(limit);
      console.log("aggggree",datalist2)
      var respData = commonController.paginationSetup(
        start,
        limit,
        numRows,
        datalist2.length
      );
      respData.list = datalist2;
      sendData["data"] = respData;
      callback(sendData);
    } else {
      var condition = {
        name: { $regex: search, $options: "i" },
        deleted: false,
      };
      var numRows = await service_categoryModal.find(condition).count();
      var datalist2 = await service_categoryModal
        .aggregate([
          {
            $match: {
              name: { $regex: search, $options: "i" },
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
        datalist2.length
      );
      respData.list = datalist2;
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
          _id: mongoose.mongo.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "service_category",
          localField: "parent_id",
          foreignField: "_id",
          as: "branches",
        },
      },
      // {
      //   $unwind:"$branches"
      // },
      {
        $project: {
          name: 1,
          icon: 1,
          parent_name: "$branches.name",
          parent_id: 1,
          _id: 1,
        },
      },
    ];
    var recordData = await service_categoryModal.aggregate(aggre);
    console.log("recorddata", recordData);
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
    var userData = data.userData;

    if (id != "") {
      //if id is empty then make new insert
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updatedata = {
        deleted: true,
      };

      var respData = await service_categoryModal.updateOne(
        condition,
        updatedata
      );

      var condition2 = {
        parent_id: mongoose.mongo.ObjectId(id.toString()),
      };
      var delete_sub = await service_categoryModal.updateMany(
        condition2,
        updatedata
      );

      sendData["data"] = {};
      sendData["msg"] = "Question removed from database";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },

  LIST_CATEGORY: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };

    //condition

    var recordData = await service_categoryModal.find({
      parent_id: { $exists: true, $eq: null },
      deleted: false,
    });
    if (recordData.length > 0) {
      sendData["data"] = recordData;
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 0;
      sendData["data"] = [];
      sendData["msg"] = "No record found.";
      callback(sendData);
    }
  },
};
