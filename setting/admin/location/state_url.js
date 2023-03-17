module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //admin inform me
    app.get("/admin/state/:country/:code", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            const { country, code } = req.params;
            var respData = {
              title: "State",
              country: country,
              config: config,
              script: {
                available: 1,
                js: "location/state",
              },
              css: {
                available: 0,
                css: "state",
              },
              menu: "state",
            };
            res.render("location/state/list.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    //admin pagination inform me
    app.get("/admin/state/list/:start/:limit/:code", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit, code } = req.params;
            const digitData = {
              start: start,
              limit: limit,
              country_code: code,
            };
            stateAdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.get("/admin/allstate/:code", function (req, res) {
      try {
        const {code } = req.params;
        const digitData = {
          country_code: code,
        };
        stateAdminController.LISTALL(digitData, function (respData) {
          res.status(respData.status).send(respData);
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.post("/admin/state/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            stateAdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/state/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            stateAdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/state/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            stateAdminController.DELETE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
  },
};
