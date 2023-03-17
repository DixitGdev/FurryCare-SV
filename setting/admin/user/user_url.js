module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //admin inform me
    app.get("/admin/user", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "User",
              config: config,
              script: {
                available: 1,
                js: "user",
              },
              css: {
                available: 0,
                css: "question",
              },
              menu: "user",
            };
            res.render("user/user.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    //admin pagination inform me
    app.get("/admin/user/list/:start/:limit", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit } = req.params;
            const digitData = {
              start: start,
              limit: limit,
            };
            userAdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/user/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            userAdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/user/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            userAdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/user/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            userAdminController.DELETE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/user/userlist", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            userAdminController.USER_LIST(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/user/paymentdetail", function (req, res) {
      try {
        var sendData = req.body;
        userAdminController.USER_PAYMENT_DETAILS(sendData, function (respData) {
          res.status(respData.status).send(respData);
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.post("/admin/payment/update", function (req, res) {
      try {
        var sendData = req.body;
        userAdminController.UPDATE_USER_PAYMENT_DETAILS(
          sendData,
          function (respData) {
            res.status(respData.status).send(respData);
          }
        );
      } catch (err) {
        res.status(404).send(err);
      }
    });
  },
};
