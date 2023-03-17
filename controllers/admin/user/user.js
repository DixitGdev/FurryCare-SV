const userModel = require("../../../models/users/users");
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
      deleted: false
    };
    var numRows = await userModel.find(condition).count();
    var professionTypeData = await userModel
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
    var recordData = await userModel.find(condition);
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
        mobile_number: data.mobile_number,
      };
      let respData = await userModel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Profession data updated in white list";
      callback(sendData);
    } else {
      //if we have id then it's edit
      var saveData = {
        mobile_number: data.mobile_number,
        email: data.email,
        password: data.password,
        createdAt: new Date(),
      };
      var respData = await userModel.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New profession added in white list";
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
      var updateData = {
        deleted: true,
      };
      var respData = await userModel.updateMany(condition, updateData);
      sendData["data"] = respData;
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

  //User list
  USER_LIST: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    //condition
    var condition = [
      {
        $lookup: {
          from: "profile",
          as: "user_profile",
          let: { u_id: "$_id" },
          pipeline: [
            {
              $match: {
                name: { $regex: data.search, $options: "i" },
                $expr: {
                  $and: [
                    { $eq: ["$user_id", "$$u_id"] },
                    {
                      $eq: ["$profile_type", 0],
                    },
                     {
                      $eq: ["$mobile_number", "8141657402"],
                    },
                    {
                      $ne: ["$name", ""],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      { $unwind: "$user_profile" },
      {
        $project: {
          _id: "$_id",
          name: "$user_profile.name",
        },
      },
    ];
    var recordData = await userModel.aggregate(condition);
    if (recordData.length > 0) {
      sendData["data"] = recordData;
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 0;
      sendData["data"] = {};
      sendData["msg"] = "No record found.";
      callback(sendData);
    }
  },

  //get payment data
  USER_PAYMENT_DETAILS: async function (data, callback) {
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
      user_id: mongoose.mongo.ObjectId(id),
    };
    var recordData = await userPaymentModel.findOne(condition);
    if (recordData) {
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

  //update payment data
  UPDATE_USER_PAYMENT_DETAILS: async function (data, callback) {
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
        community: data.community,
        post: data.post,
        superpower: data.superpower,
        intenttomeet: data.intenttomeet,
        candid_location: data.candid_location,
        used_intant_to_meet_limit: data.used_intant_to_meet_limit,
      };
      let respData = await userPaymentModel.updateOne(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Payment data updated.";
      callback(sendData);
    } else {
      sendData["data"] = {};
      sendData["msg"] = "Data not found! ";
      sendData["status"] = 406;
      callback(sendData);
    }
  },
};
