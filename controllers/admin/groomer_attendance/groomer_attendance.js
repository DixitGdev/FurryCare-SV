const groomer_attendance_model = require("../../../models/groomer_attendance/groomer_attendance");
var moment = require("moment");
const groomer_break_model = require("../../../models/groomer_break/groomer_break");

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
    var b1 = data.break_in;
    console.log("b1>>", b1);
    //for time
    var start_time = `${data.date} ${data.start_time}`;
    var end_time = `${data.date} ${data.end_time}`;

    var time1 = new Date(start_time);
    var time2 = new Date(end_time);

    function timeDiff(t1, t2) {
      var ms = moment(t2).diff(moment(t1));
      //var formattedDuration = moment.utc(ms).format("HH:mm:ss");
      return ms;
    }
    // for break
    var break_start = [];
    var break_end = [];
    var break_in = [];
    var break_out = [];

    if (data.break_in) {
      for (var i = 0; i < data.break_in.length; i++) {
        break_start.push(`${data.date} ${data.break_in[i]}`);
        break_in.push(new Date(break_start[i]));
      }
    }

    if (data.break_out) {
      for (var j = 0; j < data.break_out.length; j++) {
        break_end.push(`${data.date} ${data.break_out[j]}`);
        break_out.push(new Date(break_end[j]));
      }
    }

    console.log("break_start", break_start);
    console.log("break_end", break_end);
    console.log("break_in", break_in);
    console.log("break_out", break_out);

    var breakHours = 0;
    for (var i = 0; i < break_in.length; i++) {
      breakHours += moment(break_out[i]).diff(moment(break_in[i]));
    }
    var formattedBreakHours = moment.utc(breakHours).format("HH:mm:ss");

    var workingHours = timeDiff(time1, time2) - breakHours;
    var formattedWorkingHours = moment.utc(workingHours).format("HH:mm:ss");
    var formattotal = moment.utc(timeDiff(time1, time2)).format("HH:mm:ss");

    //edit
    if (id != "") {
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updateData = {
        groomer_id: data.groomer_id,
        date: data.date,
        start_time: time1,
        end_time: time2,
        total_hours: formattotal,
        break_hours: formattedBreakHours,
        working_hours: formattedWorkingHours,
        early_reason: data.early_reason,
      };

      let respData = await groomer_attendance_model.updateOne(
        condition,
        updateData
      );

      var condition2 = {
        groomer_id: mongoose.mongo.ObjectId(data.groomer_id.toString()),
        date: new Date(data.date),
      };

      var existingBreaks = await groomer_break_model.find(condition2);
      console.log("existingBreaks", existingBreaks);
      // get the break_in and break_out arrays from the existing data
      var existingBreakIn = existingBreaks.map(
        (breakData) => breakData.break_in
      );
      console.log("existingBreakIn", existingBreakIn);
      var existingBreakOut = existingBreaks.map(
        (breakData) => breakData.break_out
      );
      console.log("existingBreakOut", existingBreakOut);

      // remove existing breaks from the database
      var deletdata = await groomer_break_model.deleteMany(condition2);

      // add new breaks to the database
      for (var i = 0; i < break_in.length; i++) {
        if (!existingBreakIn.includes(break_in[i]) || !existingBreakOut.includes(break_out[i])) {
          var updatedata2 = {
            groomer_id: data.groomer_id,
            date: data.date,
            break_in: break_in[i],
            break_out: break_out[i],
          };
         var createdata= await groomer_break_model.create(updatedata2);
        }
      }

      sendData["data"] = respData;
      sendData["msg"] = "Groomer attendance data updated in white list";
      callback(sendData);
    }

    //create
    else {
      var saveData = {
        groomer_id: data.groomer_id,
        date: data.date,
        start_time: time1,
        end_time: time2,
        total_hours: formattotal,
        break_hours: formattedBreakHours,
        working_hours: formattedWorkingHours,
        early_reason: data.early_reason,
      };

      console.log("savedata", saveData);
      var respData = await groomer_attendance_model.create(saveData);

      for (var i = 0; i < break_in.length; i++) {
        var saveData2;
        saveData2 = {
          groomer_id: data.groomer_id,
          date: data.date,
          break_in: break_in[i],
          break_out: break_out[i],
        };
        var respData2 = await groomer_break_model.create(saveData2);
      }

      (sendData["data"] = respData),
        (sendData["msg"] = "Groomer Attendance added in white list");
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
        $lookup: {
          from: "groomers",
          localField: "groomer_id",
          foreignField: "_id",
          as: "groomer_data",
        },
      },
      { $unwind: "$groomer_data" },

      {
        $project: {
          groomern: "$groomer_data.name",
          groomer_id: 1,
          _id: 1,
          date: 1,
          start_time: 1,
          end_time: 1,
          total_hours: 1,
          break_hours: 1,
          early_reason: 1,
          working_hours: 1,
        },
      },
      {
        $match: {
          groomern: { $regex: search, $options: "i" },
        },
      },
      // {
      //   $sort: { created_at: -1 },
      // },
    ];

    if (search == "") {
      var numRows = await groomer_attendance_model.find().count();
      var professionTypeData = await groomer_attendance_model
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
      var numRows = await groomer_attendance_model.aggregate(aggre);
      var professionTypeData = await groomer_attendance_model
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
    
    var aggre = [
      {
        $match: {
          _id: mongoose.mongo.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "groomer_break",
          let: { groomer_id: "$groomer_id", date: "$date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$groomer_id", "$$groomer_id"] },
                    { $eq: ["$date", "$$date"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$groomer_id",
                break_ins: { $push: "$break_in" },
                break_outs: { $push: "$break_out" },
              },
            },
          ],
          as: "break_data",
        },
      },
      {
        $addFields: {
          break_data: {
            $ifNull: ["$break_data", [{ break_ins: [], break_outs: [] }]],
          },
        },
      },
      {
        $unwind: {
          path: "$break_data",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          groomer_id: 1,
          start_time: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          end_time: 1,
          break_data: 1,
          early_reason: 1,
          break_hours: 1,
          total_hours: 1,
          working_hours: 1,
        },
      },
    ];

    var recordData = await groomer_attendance_model.aggregate(aggre);
    console.log("recoredddd0", recordData);
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

      var finddata = await groomer_attendance_model.findOne(condition);

      var groomer = finddata.groomer_id;
      var date = finddata.date;

      var condition2 = {
        groomer_id: mongoose.mongo.ObjectId(groomer.toString()),
        date: date,
      };

      var deletedata = await groomer_break_model.deleteMany(condition2);
      var respData = await groomer_attendance_model.deleteOne(condition);

      sendData["data"] = respData;
      sendData["msg"] = "Groomer attendance removed from database";
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

// var aggre2 = [
//   {
//     $match: {
//       groomer_id: "$groomer_id",
//       date: "$date",
//     },
//   },
//   {
//     $group: {
//       _id: "$groomer_id",
//       totalBreakHours: { $sum: { $subtract: ["$break_out", "$break_in"] } },
//     },
//   },
// ];

// var resp = await groomer_break_model.aggregate(aggre2);
// console.log("resp", resp);
