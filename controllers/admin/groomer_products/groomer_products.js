const groomer_productsModal = require("../../../models/groomer_products/groomer_products");

module.exports = {
  SAVE: async function (data, callback) {
    //send data
    var sendData = {
      status: 200,
      err: 0,
      data: {},
      msg: "",
    };
    var name = data.name;
    var check_name = await groomer_productsModal.find({
      name: name,
      deleted: false,
    });
    console.log("data", data);
    var id = data.id;
    // console.log(id);
    if (id) {
      // console.log(id, "id");
      var check_id_name = await groomer_productsModal.findOne({
        name: name,
        _id: id,
        deleted: false,
      });
      var condition = {
        _id: mongoose.mongo.ObjectId(id.toString()),
      };
      if (check_id_name) {
        var updateData = {
          name: data.name,
          stock: data.stock,
          updated_at: new Date(),
        };
        let respData = await groomer_productsModal.updateOne(
          condition,
          updateData
        );
        sendData["data"] = respData;
        sendData["msg"] = "Groomer Products data updated successfully";
        callback(sendData);
      } else if (check_name.length > 0) {
        sendData.err = 1;
        sendData.msg = "You can't save Groomer Products with same Name";
        callback(sendData);
      } else {
        var updateData = {
          name: data.name,
          stock: data.stock,
          updated_at: new Date(),
        };
        let respData = await groomer_productsModal.updateOne(
          condition,
          updateData
        );
        sendData["data"] = respData;
        sendData["msg"] = "Groomer Products data updated successfully";
        callback(sendData);
      }
    } else {
      if (check_name.length > 0) {
        sendData.err = 1;
        sendData.msg = "You can't save Groomer Products with same Name";
        callback(sendData);
      } else {
        //if we have id then it's edit
        var saveData = {
          name: data.name,
          stock: data.stock,
          created_at: new Date(),
        };
        var respData = await groomer_productsModal.create(saveData);

        sendData["data"] = respData;
        sendData["msg"] = "New Groomer Products added in record";
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

    if (data.search === "") {
      var condition = {
        deleted: false,
      };
      var numRows = await groomer_productsModal.find(condition).count();
      var professionTypeData = await groomer_productsModal
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
    } else {
      var condition = {
        deleted: false,
        name: { $regex: data.search, $options: "-i" },
      };

      var numRows = await groomer_productsModal.find(condition).count();
      // console.log("numRows", numRows);
      var professionTypeData = await groomer_productsModal
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

    var recordData = await groomer_productsModal.find(condition);
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

      var respData = await groomer_productsModal.updateMany(
        condition,
        updateData
      );
      sendData["data"] = respData;
      sendData["msg"] = "Groomer Product deleted successfully";
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
      var condition = {
        deleted: false,
      };

      var respData = await groomer_productsModal.find(condition, {
        _id: 1,
        name: 1,
      });
      if (respData.length>0) {
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
