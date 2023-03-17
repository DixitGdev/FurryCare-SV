const packagesmodel = require("../../../models/packages/packages");
const service_categoryModal = require("../../../models/service_category/service_category")
const countryModel = require("../../../models/location/country")


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
    var search = data.search

    console.log("data", data);

    var aggrecondition = [
      {
        $match: { "deleted": false }
      },
      {
        $lookup: {
          "from": "country",
          "localField": "country",
          "foreignField": "country_code",
          "as": "countryData"
        },
      },
      { $unwind: "$countryData" },
      {
        $lookup: {
          "from": "states",
          "localField": "state",
          "foreignField": "_id",
          "as": "stateData"
        },
      },
      { $unwind: "$stateData" },
      {
        $lookup: {
          "from": "city",
          "localField": "city",
          "foreignField": "_id",
          "as": "cityData"
        },
      },
      { $unwind: "$cityData" },
      {
        $lookup: {
          "from": "service_category",
          "localField": "category_id",
          "foreignField": "_id",
          "as": "categoryData"
        },
      },
      { $unwind: "$categoryData" },
      {
        $lookup: {
          "from": "service_category",
          "localField": "subcategory_id",
          "foreignField": "_id",
          "as": "subcategoryData"
        },
      },
      { $unwind: "$subcategoryData" },
      {
        $match: {
          $or: [
            { "categoryData.name": { $regex: data.search, $options: "-i" } },
            { "subcategoryData.name": { $regex: data.search, $options: "-i" } },
            { title: { $regex: data.search, $options: "-i" } },
            { description: { $regex: data.search, $options: "-i" } },
            { price: parseInt(data.search) },
            { pet: { $regex: data.search, $options: "-i" } },
            { "countryData.name": { $regex: data.search, $options: "-i" } },
            { "stateData.name": { $regex: data.search, $options: "-i" } },
            { "cityData.name": { $regex: data.search, $options: "-i" } },
          ],
        },
      },
      {
        $project: {
          "category_name": "$categoryData.name",
          "subcategory_name": "$subcategoryData.name",
          "title": 1,
          "description": 1,
          "price": 1,
          "pet": 1,
          "country_name": "$countryData.name",
          "state_name": "$stateData.name",
          "city_name": "$cityData.name",
        }
      }
    ]

    // var locationname = await packagesmodel.aggregate(aggrecondition)
    // console.log("locationname", locationname);

    if (search === "") {
      var condition = {
        deleted: false,
      };
      var numRows = await packagesmodel.find(condition).count();
      var professionTypeData = await packagesmodel
        .aggregate(aggrecondition)
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
          $match: { "deleted": false }
        },
        {
          $lookup: {
            "from": "country",
            "localField": "country",
            "foreignField": "country_code",
            "as": "countryData"
          },
        },
        { $unwind: "$countryData" },
        {
          $lookup: {
            "from": "states",
            "localField": "state",
            "foreignField": "_id",
            "as": "stateData"
          },
        },
        { $unwind: "$stateData" },
        {
          $lookup: {
            "from": "city",
            "localField": "city",
            "foreignField": "_id",
            "as": "cityData"
          },
        },
        { $unwind: "$cityData" },
        {
          $lookup: {
            "from": "service_category",
            "localField": "category_id",
            "foreignField": "_id",
            "as": "categoryData"
          },
        },
        { $unwind: "$categoryData" },
        {
          $lookup: {
            "from": "service_category",
            "localField": "subcategory_id",
            "foreignField": "_id",
            "as": "subcategoryData"
          },
        },
        { $unwind: "$subcategoryData" },
        {
          $match: {
            $or: [
              { "categoryData.name": { $regex: data.search, $options: "-i" } },
              { "subcategoryData.name": { $regex: data.search, $options: "-i" } },
              { title: { $regex: data.search, $options: "-i" } },
              { description: { $regex: data.search, $options: "-i" } },
              { price: parseInt(data.search) },
              { pet: { $regex: data.search, $options: "-i" } },
              { "countryData.name": { $regex: data.search, $options: "-i" } },
              { "stateData.name": { $regex: data.search, $options: "-i" } },
              { "cityData.name": { $regex: data.search, $options: "-i" } },
            ],
          },
        },
        {
          $project: {
            "category_name": "$categoryData.name",
            "subcategory_name": "$subcategoryData.name",
            "title": 1,
            "description": 1,
            "price": 1,
            "pet": 1,
            "country_name": "$countryData.name",
            "state_name": "$stateData.name",
            "city_name": "$cityData.name",
          }
        }
      ]


      var numRows = await packagesmodel.aggregate(condition);
      // console.log("numRows", numRows);
      var professionTypeData = await packagesmodel
        .aggregate(aggrecondition)
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

  },




  // if (search === "") {
  //   var numRows = await packagesmodel.find({ "deleted": false }).count();
  //   var professionTypeData = await packagesmodel
  //     .aggregate(aggrecondition)
  //     .skip((start - 1) * limit)
  //     .limit(limit);
  //   console.log("professionTypeData>>>>", professionTypeData);

  //   var respData = commonController.paginationSetup(
  //     start,
  //     limit,
  //     numRows,
  //     professionTypeData.length
  //   )

  //   respData.list = professionTypeData;
  //   sendData["data"] = respData;
  //   callback(sendData);

  // } else {
  //   var condition1 = {
  //     "deleted": false,
  //     "title": { $regex: search, $options: "i" }
  //   }
  //   var numRows = await packagesmodel.find(condition1).count()
  //   var datalist2 = await packagesmodel
  //     .aggregate([{
  //       $match: {
  //         title: { $regex: search, $options: "i" }
  //       }
  //     }, ...aggrecondition])
  //     .skip((start - 1) * limit)
  //     .limit(limit);


  //   var respData = commonController.paginationSetup(
  //     start,
  //     limit,
  //     numRows,
  //     datalist2.length
  //   )

  //   respData.list = datalist2;
  //   sendData["data"] = respData;
  //   callback(sendData);
  // }



// },
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
    var aggrecondition = [
      {
        $match: { "deleted": false, "_id": mongoose.mongo.ObjectId(id), }

      },
      {
        $lookup: {
          "from": "country",
          "localField": "country",
          "foreignField": "country_code",
          "as": "countryData"
        },
      },
      { $unwind: "$countryData" },
      {
        $lookup: {
          "from": "states",
          "localField": "state",
          "foreignField": "_id",
          "as": "stateData"
        },
      },
      { $unwind: "$stateData" },
      {
        $lookup: {
          "from": "city",
          "localField": "city",
          "foreignField": "_id",
          "as": "cityData"
        },
      },
      { $unwind: "$cityData" },
      {
        $lookup: {
          "from": "service_category",
          "localField": "category_id",
          "foreignField": "_id",
          "as": "categoryData"
        },
      },
      { $unwind: "$categoryData" },
      {
        $lookup: {
          "from": "service_category",
          "localField": "subcategory_id",
          "foreignField": "_id",
          "as": "subcategoryData"
        },
      },
      { $unwind: "$subcategoryData" },
      {
        $project: {
          "category_name": "$categoryData.name",
          "subcategory_name": "$subcategoryData.name",
          "category_id": 1,
          "subcategory_id": 1,
          "title": 1,
          "description": 1,
          "price": 1,
          "country": 1,
          "state": 1,
          "city": 1,
          "pet": 1,
          "country_name": "$countryData.name",
          "state_name": "$stateData.name",
          "city_name": "$cityData.name",
        }
      }
    ]

    var recordData = await packagesmodel.aggregate(aggrecondition)


    // var condition = {
    //   _id: mongoose.mongo.ObjectId(id),
    // };

    // var recordData = await packagesmodel.find(condition)
    console.log("recordData", recordData);
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

SAVE: async function (data, callback) {
  //send data
  var sendData = {
    status: 200,
    err: 0,
    data: {},
    msg: "",
  };
  var id = data.id;
  var title = data.title
  var check_title = await packagesmodel.find({
    title: title,
    deleted: false,
    pet: data.pet,
  });

  if (id != '') {

    var check_id_title = await packagesmodel.findOne({
      title: title,
      _id: id,
      deleted: false,
      pet: data.pet,
    });

    var condition = {
      _id: mongoose.mongo.ObjectId(id.toString()),
    };


    if (check_id_title) {
      var updateData = {
        category_id: data.category_id,
        subcategory_id: data.subcategory_id ? data.subcategory_id : null,
        title: data.title,
        description: data.description,
        price: data.price,
        country: data.country,
        state: data.state,
        city: data.city,
        pet: data.pet,
        updated_at: new Date()
      };
      let respData = await packagesmodel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Profession data updated in white list";
      callback(sendData);

    } else if (check_title.length > 0) {
      sendData.err = 1;
      sendData.msg = "you can't save packages with same Title";
      callback(sendData);
    }
    else {
      var updateData = {
        category_id: data.category_id,
        subcategory_id: data.subcategory_id ? data.subcategory_id : null,
        title: data.title,
        description: data.description,
        price: data.price,
        country: data.country,
        state: data.state,
        city: data.city,
        pet: data.pet,
        updated_at: new Date()
      };
      let respData = await packagesmodel.updateMany(condition, updateData);
      sendData["data"] = respData;
      sendData["msg"] = "Profession data updated in white list";
      callback(sendData);
    }
  } else {

    if (check_title.length > 0) {
      sendData.err = 1;
      sendData.msg = "you can't save packages with same Title";
      callback(sendData);
    } else {
      //if we have id then it's edit
      var saveData = {
        category_id: data.category_id,
        subcategory_id: data.subcategory_id ? data.subcategory_id : null,
        title: data.title,
        description: data.description,
        price: data.price,
        country: data.country,
        state: data.state,
        city: data.city,
        pet: data.pet,
        created_at: new Date(),
      };
      var respData = await packagesmodel.create(saveData);

      sendData["data"] = respData;
      sendData["msg"] = "New profession added in white list";
      callback(sendData);
    }


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

    var updateData = {
      deleted: true,
    };
    var respData = await packagesmodel.updateMany(condition, updateData);
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


PACKAGE_CATEGORY: async function (data, callback) {
  //send data
  var sendData = {
    status: 200,
    err: 0,
    data: {},
    msg: "",
  };
  var id = data.id;
  //condition

  // var condition = {
  //   parent_id : ObjectId(data._id)
  // }

  var recordData = await service_categoryModal.find({ parent_id: { "$exists": true, "$eq": null }, deleted: false })
  if (recordData.length > 0) {
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

PACKAGE_SUBCATEGORY: async function (data, callback) {
  //send data
  var sendData = {
    status: 200,
    err: 0,
    data: {},
    msg: "",
  };
  var id = data.id;
  //condition

  console.log("data", data);

  var condition = {
    parent_id: mongoose.mongo.ObjectId(data._id),
  }

  // const aggre = [
  //   { $match : {parent_id: mongoose.mongo.ObjectId(data._id)}},
  //   {
  //     $lookup: {
  //       from: "service_category",
  //       localField: "parent_id",
  //       foreignField: "_id",
  //       as: "branches"
  //     }
  //   },
  //   // {
  //   //   $unwind:"$branches"
  //   // },
  //   {
  //     $project: {
  //       name: 1,
  //       icon:1,
  //       parent_name:"$branches.name"
  //     },
  //   },
  // ];

  // var dataa= await service_categoryModal.aggregate(aggre)

  // console.log("datta",dataa);

  var recordData = await service_categoryModal.find(condition)


  console.log("recorddata", recordData);
  if (recordData.length > 0) {
    sendData["data"] = recordData;
    callback(sendData);
  } else {
    sendData["status"] = 200;
    sendData["err"] = 1;
    sendData["data"] = {};
    sendData["msg"] = "No record found.";
    callback(sendData);
  }
},
}