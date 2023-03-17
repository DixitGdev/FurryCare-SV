const addonsModal = require("../../../models/addons/addons");

module.exports = {
  SAVE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    var title = data.title;
    var check_title = await addonsModal.find({
      title: title,
      deleted: false,
      pet: data.pet,
    });
    console.log("data", data);
    var id = data.id;
    // console.log(id);
    if (id) {
      // console.log(id, "id");
      var check_id_title = await addonsModal.findOne({
        title: title,
        _id: id,
        deleted: false,
        pet: data.pet,
      });
      var check_title = await addonsModal.find({
        title: title,
        deleted: false,
        pet: data.pet,
      });
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      if (check_id_title) {
        var updateData = {
          title: data.title,
          description: data.description,
          price: data.price,
          country: data.country,
          state: data.state,
          city: data.city,
          pet: data.pet,
          updated_at: new Date(),
        };
        let respData = await addonsModal.updateOne(condition, updateData);
        sendData["data"] = respData;
        sendData["msg"] = "Add-ons data updated successfully";
        callback(sendData);
      } else if (check_title.length > 0) {
        sendData.err = 1;
        sendData.msg = "You can't save Add-ons with same Title for same Pet";
        callback(sendData);
      } else {
        var updateData = {
          title: data.title,
          description: data.description,
          price: data.price,
          country: data.country,
          state: data.state,
          city: data.city,
          pet: data.pet,
          updated_at: new Date(),
        };
        let respData = await addonsModal.updateOne(condition, updateData);
        sendData["data"] = respData;
        sendData["msg"] = "Add-ons data updated successfully";
        callback(sendData);
      }
    } else {
      if (check_title.length > 0) {
        sendData.err = 1;
        sendData.msg = "You can't save Add-ons with same Title for same Pet";
        callback(sendData);
      } else {
        //if we have id then it's edit
        var saveData = {
          title: data.title,
          description: data.description,
          price: data.price,
          country: data.country,
          state: data.state,
          city: data.city,
          pet: data.pet,
          created_at: new Date(),
        };
        var respData = await addonsModal.create(saveData);

        sendData["data"] = respData;
        sendData["msg"] = "New Add-ons added in record";
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

    // var condition1 = {title: { $regex: search, '$options': 'i' }}
    // var fgfgfg = await addonsModal.find(condition1);
    // console.log("b", data.search);
    const nameofcountrystatecity = [
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
        $match: {
          $or: [
            { title: { $regex: data.search, $options: "-i" } },
            { description: { $regex: data.search, $options: "-i" } },
            { price: parseInt(data.search) },
            { pet: { $regex: data.search, $options: "-i" } },
            { "country_data.name": { $regex: data.search, $options: "-i" } },
            { "state_data.name": { $regex: data.search, $options: "-i" } },
            { "city_data.name": { $regex: data.search, $options: "-i" } },
          ],
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          pet: 1,
          countryname: "$country_data.name",
          statename: "$state_data.name",
          cityname: "$city_data.name",
        },
      },
    ];
    if (data.search === "") {
      var condition = {
        deleted: false,
      };
      var numRows = await addonsModal.find(condition).count();
      var professionTypeData = await addonsModal
        .aggregate(nameofcountrystatecity)
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
      // console.log("c", data.search);
    } else {
      const condition = [
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
          $match: {
            $or: [
              { title: { $regex: data.search, $options: "-i" } },
              { description: { $regex: data.search, $options: "-i" } },
              { price: parseInt(data.search) },
              { pet: { $regex: data.search, $options: "-i" } },
              { "country_data.name": { $regex: data.search, $options: "-i" } },
              { "state_data.name": { $regex: data.search, $options: "-i" } },
              { "city_data.name": { $regex: data.search, $options: "-i" } },
            ],
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            price: 1,
            pet: 1,
            countryname: "$country_data.name",
            statename: "$state_data.name",
            cityname: "$city_data.name",
          },
        },
      ];

      var numRows = await addonsModal.aggregate(condition);
      // console.log("numRows", numRows);
      var professionTypeData = await addonsModal
        .aggregate(nameofcountrystatecity)
        .skip((start - 1) * limit)
        .limit(limit);
      var respData = commonController.paginationSetup(
        start,
        limit,
        numRows.length,
        professionTypeData.length
      );
      // console.log(professionTypeData, "professionTypeData");
      respData.list = professionTypeData;
      sendData["data"] = respData;
      callback(sendData);
    }

    // var name = await addonsModal.aggregate(nameofcountrystatecity);
    // console.log(name);

    //condition
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
          title: 1,
          description: 1,
          price: 1,
          country: 1,
          state: 1,
          city: 1,
          pet: 1,
          countryname: "$country_data.name",
          statename: "$state_data.name",
          cityname: "$city_data.name",
        },
      },
    ];

    var recordData = await addonsModal.aggregate(condition);
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

    if (id) {
      //if id is empty then make new insert
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      var updateData = {
        deleted: true,
      };

      var respData = await addonsModal.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Add-ons deleted successfully";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },
  LISTALL: async function (data, callback) {
    try {
      var sendData = {
        status: 200,
        err: 0,
        data: {},
        msg: "",
      };
      var pet = data.pet;

      //if id is empty then make new insert
      var condition = {
        pet: pet,
        deleted: false,
      };

      var respData = await addonsModal.find(condition, {
        _id: 1,
        price: 1,
        title: 1,
      });
      if (respData) {
        sendData["data"] = respData;
        sendData["msg"] = "data found successfully";
        sendData["status"] = 200;
        sendData["err"] = 0;
        callback(sendData);
      } else {
        sendData["msg"] = "no data found";
        sendData["data"] = {};
        sendData["err"] = 1;
        sendData["status"] = 200;
        callback(sendData);
      }
    } catch (err) {
      console.log(err.message);
      sendData["msg"] = err.message;
      sendData["data"] = {};
      sendData["err"] = 1;
      sendData["status"] = 500;
      callback(sendData);
    }
  },
};
