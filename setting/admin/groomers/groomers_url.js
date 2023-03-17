module.exports = {
    BindUrl: function () {
      var selfInst = this;
  
      //admin inform me
      app.get("/admin/groomers", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.redirect("/admin");
            } else {
              var respData = {
                title: "Groomers",
                config: config,
                script: {
                  available: 1,
                  js: "groomers",
                },
                css: {
                  available: 0,
                  css: "question",
                },
                menu: "Groomers",
              };
              res.render("groomers/groomers.html", respData);
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomers/save", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              groomersAdmincontroller.SAVE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomers/list/:start/:limit", function (req, res) {
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
              groomersAdmincontroller.LIST(digitData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomers/view", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              groomersAdmincontroller.VIEW(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });
      
      app.post("/admin/groomers/delete", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              var sendData = req.body;
              sendData["userData"] = respData.data;
              groomersAdmincontroller.DELETE(
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


      app.get("/admin/groomers/list_all/", function (req, res) {
        try {
          const sendData = {};
          // sendData.id=req.params.id
          groomersAdmincontroller.LIST_ALL_GROOMERS(
            sendData,
            function (respData) {
              res.status(respData.status).send(respData);
            }
          );
        } catch (err) {
          res.status(404).send(err);
        }
      });
      
    }
}