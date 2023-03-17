const groomer_tool_req_Modal = require("../../../models/groomer_tool_req/groomer_tool_req");
const groomer_product_Modal = require("../../../models/groomer_products/groomer_products");

module.exports = {
  SAVE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };

    console.log("data", data);
    var id = data.id;
    var productID = data.product;
    var quantity = parseInt(data.quantity);

    // console.log(id);
    if (id) {
      // console.log(id, "id");
      var updateData = {
        groomer: data.groomer,
        product: data.product,
        quantity: data.quantity,
        status: data.status,
        updated_at: new Date(),
      };
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };

      var checkProductID = await groomer_product_Modal.findOne({
        _id: productID,
      });
      // console.log(checkProductID);
      if (quantity <= checkProductID.stock) {
        if (data.status === "Approve") {
          var updateStock = {
            stock: parseInt(checkProductID.stock - quantity),
          };
          var updateQuantity = await groomer_product_Modal.updateOne(
            checkProductID,
            updateStock
          );
        }

        let respData = await groomer_tool_req_Modal.updateOne(
          condition,
          updateData
        );

        var updateStock = {
          stock: parseInt(checkProductID.stock + quantity),
        };
        var updateQuantity = await groomer_product_Modal.updateOne(
          checkProductID,
          updateStock
        );

        sendData["data"] = respData;
        sendData["msg"] = "Groomer Tool Request data updated successfully";
        callback(sendData);
      } else {
        updateData.status = "Pending";
        var respData = await groomer_tool_req_Modal.updateOne(
          condition,
          updateData
        );
        sendData["data"] = respData;
        sendData["msg"] =
          "Number of Quantity is not availble in stock so status is Pending";
        callback(sendData);
      }
    } else {
      //if we have id then it's edit
      // console.log("product...", data.product);
      var saveData = {
        groomer: data.groomer,
        product: data.product,
        quantity: data.quantity,
        status: data.status,
        created_at: new Date(),
      };

      var checkProductID = await groomer_product_Modal.findOne({
        _id: productID,
      });
      // console.log(checkProductID);
      if (quantity <= checkProductID.stock) {
        if (data.status === "Approve") {
          var updateStock = {
            stock: parseInt(checkProductID.stock - quantity),
          };
          var updateQuantity = await groomer_product_Modal.updateOne(
            checkProductID,
            updateStock
          );
        }

        var respData = await groomer_tool_req_Modal.create(saveData);

        sendData["data"] = respData;
        sendData["msg"] = "New Groomer Tool Request added in record";
        callback(sendData);
      } else {
        saveData.status = "Pending";
        var respData = await groomer_tool_req_Modal.create(saveData);
        sendData["data"] = respData;
        sendData["msg"] =
          "Number of Quantity is not availble in stock so status is Pending";
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

    const nameofgroomerandproduct = [
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
        $lookup: {
          from: "groomer_products",
          localField: "product",
          foreignField: "_id",
          as: "product_data",
        },
      },
      { $unwind: "$product_data" },
      {
        $project: {
          _id: 1,
          deleted: 1,
          status: 1,
          quantity: 1,
          created_at:1,
          groomer: "$groomer_data.name",
          product: "$product_data.name",
          order: {
            $cond: {
              if: { $eq: ["$status", "Pending"] },
              then: 1,
              else: 2,
            },
          },
        },
      },
      { $sort: { order: 1, created_at: -1 } },
    ];

    //   db.task.aggregate([
    //     { "$project" : {
    //         "_id" : 1,
    //         "task" : 1,
    //         "status" : 1,
    //         "order" : {
    //             "$cond" : {
    //                 if : { "$eq" : ["$status", "new"] }, then : 1,
    //                 else  : { "$cond" : {
    //                     "if" : { "$eq" : ["$status", "pending"] }, then : 2,
    //                     else  : 3
    //                     }
    //                 }
    //             }
    //         }
    //     } },
    //     {"$sort" : {"order" : 1} },
    //     { "$project" : { "_id" : 1, "task" : 1, "status" : 1 } }
    // ])

    var condition = {
      deleted: false,
    };
    var numRows = await groomer_tool_req_Modal.find(condition).count();
    var professionTypeData = await groomer_tool_req_Modal
      .aggregate(nameofgroomerandproduct)
      .skip((start - 1) * limit)
      .limit(limit);
    // console.log(professionTypeData, "professionTypeData");

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
          from: "groomers",
          localField: "groomer",
          foreignField: "_id",
          as: "groomer_data",
        },
      },
      { $unwind: "$groomer_data" },
      {
        $lookup: {
          from: "groomer_products",
          localField: "product",
          foreignField: "_id",
          as: "product_data",
        },
      },
      { $unwind: "$product_data" },
      {
        $project: {
          _id: 1,
          deleted: 1,
          status: 1,
          quantity: 1,
          groomer: 1,
          product: 1,
          groomername: "$groomer_data.name",
          productname: "$product_data.name",
        },
      },
    ];

    var recordData = await groomer_tool_req_Modal.aggregate(condition);
    if (recordData.length > 0) {
      recordData = recordData[0];
      console.log("recordData", recordData);
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

      var checkProductID = await groomer_tool_req_Modal.findOne({
        _id: id,
      });
      // console.log(checkProductID);

      if (checkProductID.status === "Approve") {
        var checkProduct = await groomer_product_Modal.findOne({
          _id: checkProductID.product,
        });

        var quantity = parseInt(checkProductID.quantity);
        var updateStock = {
          stock: parseInt(checkProduct.stock + quantity),
        };
        var updateQuantity = await groomer_product_Modal.updateOne(
          checkProduct,
          updateStock
        );
      }
      var respData = await groomer_tool_req_Modal.updateMany(
        condition,
        updateData
      );
      sendData["data"] = respData;
      sendData["msg"] = "Groomer tool request deleted successfully";
      callback(sendData);
    } else {
      sendData["status"] = 200;
      sendData["err"] = 1;
      sendData["data"] = {};
      sendData["msg"] = "No record found!";
      callback(sendData);
    }
  },
  //   LISTALL: async function (data, callback) {
  //     try {
  //       var sendData = {
  //         status: 200,
  //         err: 0,
  //         data: {},
  //         msg: "",
  //       };
  //       var pet = data.pet;

  //       //if id is empty then make new insert
  //       var condition = {
  //         pet: pet,
  //         deleted: false,
  //       };

  //       var respData = await addonsModal.find(condition, {
  //         _id: 1,
  //         price: 1,
  //         title: 1,
  //       });
  //       if (respData) {
  //         sendData["data"] = respData;
  //         sendData["msg"] = "data found successfully";
  //         sendData["status"] = 200;
  //         sendData["err"] = 0;
  //         callback(sendData);
  //       } else {
  //         sendData["msg"] = "no data found";
  //         sendData["data"] = {};
  //         sendData["err"] = 1;
  //         sendData["status"] = 200;
  //         callback(sendData);
  //       }
  //     } catch (err) {
  //       console.log(err.message);
  //       sendData["msg"] = err.message;
  //       sendData["data"] = {};
  //       sendData["err"] = 1;
  //       sendData["status"] = 500;
  //       callback(sendData);
  //     }
  //   },
};


//  