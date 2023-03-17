module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //admin inform me
    app.get("/admin/city/:state/:code", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            const { state, code } = req.params;
            var respData = {
              title: "City",
              state: state,
              config: config,
              script: {
                available: 1,
                js: "location/city",
              },
              css: {
                available: 0,
                css: "city",
              },
              menu: "city",
            };
            res.render("location/city/list.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    //admin pagination inform me
    app.get("/admin/city/list/:start/:limit/:state_id", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit, state_id } = req.params;
            const digitData = {
              start: start,
              limit: limit,
              state_id: state_id,
            };
            cityAdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.get("/admin/allcity/:state_id", function (req, res) {
      try {
        const {state_id } = req.params;
        const digitData = {
          state_id: state_id,
        };
        cityAdminController.LISTALL(digitData, function (respData) {
          res.status(respData.status).send(respData);
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.post("/admin/city/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            cityAdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/city/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            cityAdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/city/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            cityAdminController.DELETE(sendData, function (respData) {
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
