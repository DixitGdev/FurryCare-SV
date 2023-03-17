module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //addon inform
    app.get("/admin/addons", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "Add-ons",
              config: config,
              script: {
                available: 1,
                js: "addons",
              },
              css: {
                available: 0,
                css: "question",
              },
              menu: "addons",
            };
            res.render("addons/addons.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/addons/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            // console.log(sendData);
            addOnAdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/addons/list/:start/:limit", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit } = req.params;
            const search = req.body.search;
            // console.log('a', search);
            const digitData = {
              start: start,
              limit: limit,
              search: search,
            };
            addOnAdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/addons/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            addOnAdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/addons/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            addOnAdminController.DELETE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.post("/admin/addons/list", function (req, res) {
      try {
        const sendData = req.body;
        sendData.pet = req.body.pet
      
       addOnAdminController.LISTALL(sendData, function (respData) {
          res.status(respData.status).send(respData);
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
  },
};
