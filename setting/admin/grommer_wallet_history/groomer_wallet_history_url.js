module.exports = {
    BindUrl: function () {
      app.get("/admin/groomer_wallet_history/:id", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.redirect("/admin");
            } else {
              var respData = {
                title: "Groomer Wallet history",
                config: config,
                script: {
                  available: 1,
                  js: "groomer_wallet_history",
                },
                css: {
                  available: 0,
                  css: "question",
                },
                menu: "groomer_wallet_his",
                id:req.params.id

              };
              res.render("groomer_wallet_history/groomer_wallet_history.html", respData);
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });


      app.post("/admin/groomer_wallet_history/save", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              // console.log(sendData);
              groomerwallethistorycontroller.SAVE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.get("/admin/groomer_wallet_history/:id/:start/:limit", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const { start, limit,id } = req.params;
             
              const digitData = {
                start: start,
                limit: limit,
                id: id,
              };
              groomerwallethistorycontroller.LIST(digitData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_wallet_history/view", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              groomerwallethistorycontroller.VIEW(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_wallet_history/delete", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              var sendData = req.body;
              sendData["userData"] = respData.data;
              groomerwallethistorycontroller.DELETE(
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