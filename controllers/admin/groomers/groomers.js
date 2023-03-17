const e = require("cors");
const { getTestMessageUrl } = require("nodemailer");
const groomers_model = require("../../../models/groomers/groomers");

module.exports = {
  SAVE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    try {
      var id = data.id;
      var active = data.active;
      var mobile_number = data.mobile_number;
      var email = data.email;
      var name = data.name;
      var amount = data.amount;

      // var phoneno = new"/^(?([0-9]{3}))?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/";
      var indno = new RegExp(/^(0|91)?[6-9][0-9]{9}$/);

      if (active == "true") {
        active = true;
      } else {
        active = false;
      }

      var obj2 = {
        $or: [
          { email: email },
          { mobile_number: mobile_number },
        ],
      };
      var checkcond = await groomers_model.find({ deleted: false, ...obj2 });
      console.log("checkcondi", checkcond);
      //for_edit
      if (id != "") {
        var condition = {
          _id: mongoose.mongo.ObjectId(id.toString()),
        };

        var updateData = {
          mobile_number: data.mobile_number,
          name: data.name,
          email: data.email,
          amount: data.amount,
          country: data.country,
          state: data.state,
          city: data.city,
          active: active,
          country_code: data.country_code
        };
        if (data.password !== "") {
          updateData["password"] = md5(data.password);
        }
        if (indno.test(mobile_number)) {
          if (checkcond.length > 1) {
            sendData.err = 1;
            sendData.msg = "Please Enter Unique data";
            callback(sendData);
          } else {
            console.log("last else");
            let respData = await groomers_model.updateOne(
              condition,
              updateData
            );
            sendData["data"] = respData;
            sendData["msg"] = "Groomers data updated in white list";
            callback(sendData);
          }
        } else {
          sendData.err = 1;
          sendData.msg = "Please Enter valid Mobile no";
          callback(sendData);
        }
      }

      //for create____
      else {
        if (data.password !== "") {
          if (indno.test(mobile_number)) {
            if (checkcond.length > 0) {
              sendData.err = 1;
              sendData.msg = "Please Enter Unique data";
              callback(sendData);
            } else {
              var saveData = {
                name: data.name,
                mobile_number: data.mobile_number,
                email: data.email,
                amount: data.amount ? data.amount : 0,
                country: data.country,
                state: data.state,
                city: data.city,
                password: md5(data.password),
                active: active,
                created_at: new Date(),
               country_code: data.country_code
              };
              var respData = await groomers_model.create(saveData);

              sendData["data"] = respData;
              sendData["msg"] = "New Groomers added in white list";
              callback(sendData);
            }
          } else {
            sendData.err = 1;
            sendData.msg = "Please Enter valid Mobile no";
            callback(sendData);
          }
        } else {
          sendData.err = 1;
          sendData.msg = "Fields can't be empty ";
          callback(sendData);
        }
      }
    } catch (error) {
      console.log("err", error);
      sendData["msg"] = "something is wrong";
      sendData["data"] = {};
      sendData["err"] = 1;
      sendData["status"] = 500;
      callback(sendData);
    }
  },

  LIST: async function (data, callback) {
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };

    try {
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
            from: "country",
            localField: "country",
            foreignField: "country_code",
            as: "country_data",
          },
        },
        { $unwind: "$country_data" },
        {
          $lookup: {
            from: "states",
            localField: "state",
            foreignField: "_id",
            as: "state_data",
          },
        },
        { $unwind: "$state_data" },
        {
          $lookup: {
            from: "city",
            localField: "city",
            foreignField: "_id",
            as: "city_data",
          },
        },
        { $unwind: "$city_data" },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            amount: 1,
            mobile_number: 1,
            active: 1,
            countryname: "$country_data.name",
            statename: "$state_data.name",
            cityname: "$city_data.name",
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
        var numRows = await groomers_model.find(condition).count();
        var professionTypeData = await groomers_model
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
          name: { $regex: search, $options: "i" },
          deleted: false,
        };

        var numRows = await groomers_model.find(condition_search).count();
        var professionTypeData = await groomers_model
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
          professionTypeData.length
        );
        respData.list = professionTypeData;
        sendData["data"] = respData;
        callback(sendData);
      }
    } catch (error) {
      console.log("err", error);
      sendData["msg"] = error;
      sendData["data"] = {};
      sendData["err"] = 1;
      sendData["status"] = 500;
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

    const condition = [
      {
        $match: {
          deleted: false,
          _id: mongoose.mongo.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "country",
          localField: "country",
          foreignField: "country_code",
          as: "country_data",
        },
      },
      { $unwind: "$country_data" },
      {
        $lookup: {
          from: "states",
          localField: "state",
          foreignField: "_id",
          as: "state_data",
        },
      },
      { $unwind: "$state_data" },
      {
        $lookup: {
          from: "city",
          localField: "city",
          foreignField: "_id",
          as: "city_data",
        },
      },
      { $unwind: "$city_data" },
      {
        $project: {
          name: 1,
          mobile_number: 1,
          email: 1,
          password: 1,
          amount: 1,
          country: 1,
          state: 1,
          city: 1,
          active: 1,
          country_code:1,
          countryname: "$country_data.name",
          statename: "$state_data.name",
          cityname: "$city_data.name",
        },
      },
    ];
    var recordData = await groomers_model.aggregate(condition);
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

      var respData = await groomers_model.updateOne(condition, updatedata);

      sendData["data"] = {};
      sendData["msg"] = "Groomers removed from database";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },

  LIST_ALL_GROOMERS: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };

    var finddata = {
      deleted: false,
      active: true,
    };

    var respData = await groomers_model.find(finddata, { _id: 1, name: 1 });
    if (respData.length > 0) {
      sendData["data"] = respData;
      sendData["msg"] = "ALL data";
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
