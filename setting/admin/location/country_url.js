module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //admin inform addons
    app.get("/admin/country", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "Country",
              config: config,
              script: {
                available: 1,
                js: "location/country",
              },
              css: {
                available: 0,
                css: "country",
              },
              menu: "country",
            };
            res.render("location/country/list.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    //admin pagination inform addons
    app.get("/admin/country/list/:start/:limit", function (req, res) {
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
            countryAdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.get("/admin/country/listall", function (req, res) {
      try {
          countryAdminController.LISTALL(req.body, function (respData) {
            res.status(respData.status).send(respData);
          });
        } catch (err) {
        res.status(404).send(err);
      }
    });
    app.post("/admin/country/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            countryAdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/country/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            countryAdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/country/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            countryAdminController.DELETE(sendData, function (respData) {
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
