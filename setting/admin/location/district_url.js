module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //admin inform me
    app.get("/admin/district/:city/:code", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            const { city, code } = req.params;
            var respData = {
              title: "District",
              city: city,
              config: config,
              script: {
                available: 1,
                js: "location/district",
              },
              css: {
                available: 0,
                css: "district",
              },
              menu: "district",
            };
            res.render("location/district/list.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    //admin pagination inform me
    app.get("/admin/district/list/:start/:limit/:city_id", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit, city_id } = req.params;
            const digitData = {
              start: start,
              limit: limit,
              city_id: city_id,
            };
            districtAdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.get("/admin/alldistrict/:city_id", function (req, res) {
      try {
        const {city_id } = req.params;
        const digitData = {
          city_id: city_id,
        };
        districtAdminController.LISTALL(digitData, function (respData) {
          res.status(respData.status).send(respData);
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    app.post("/admin/district/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            districtAdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/district/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            districtAdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/district/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            districtAdminController.DELETE(sendData, function (respData) {
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
