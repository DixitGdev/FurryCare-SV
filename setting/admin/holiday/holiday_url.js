module.exports = {
    BindUrl: function () {
      var selfInst = this;
  
      //admin inform me
      app.get("/admin/holiday", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.redirect("/admin");
            } else {
              var respData = {
                title: "Holiday",
                config: config,
                script: {
                  available: 1,
                  js: "holiday",
                },
                css: {
                  available: 0,
                  css: "question",
                },
                menu: "Holiday",
              };
              res.render("holiday/holiday.html", respData);
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/holiday/save", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              holidayadmincontroller.SAVE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/holiday/list/:start/:limit", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const { start, limit } = req.params;
              const search = req.body.search;
              const digitData = {
                start: start,
                limit: limit,
                search: search,
              };
              holidayadmincontroller.LIST(digitData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/holiday/view", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              holidayadmincontroller.VIEW(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });


      app.post("/admin/holiday/delete", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              var sendData = req.body;
              sendData["userData"] = respData.data;
              holidayadmincontroller.DELETE(
                sendData,
                function (respData) {
                  res.status(respData.status).send(respData);
                }
              );
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });
  
    }
}