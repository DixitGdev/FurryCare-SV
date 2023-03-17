module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //addon inform
    app.get("/admin/groomer_tool_req", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "Groomer tool request",
              config: config,
              script: {
                available: 1,
                js: "groomer_tool_req",
              },
              css: {
                available: 0,
                css: "question",
              },
              menu: "groomer_tool_req",
            };
            res.render("groomer_tool_req/groomer_tool_req.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_tool_req/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            // console.log("sendDatachirag", sendData);
            groomer_tool_req_AdminController.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_tool_req/list/:start/:limit", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit } = req.params;
            // console.log('a', search);
            const digitData = {
              start: start,
              limit: limit,
            };
            groomer_tool_req_AdminController.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_tool_req/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            groomer_tool_req_AdminController.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_tool_req/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            groomer_tool_req_AdminController.DELETE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
    // app.post("/admin/allpetlist", function (req, res) {
    //   try {
    //     const sendData = req.body;
    //     sendData.pet = req.body.pet;

    //     addOnAdminController.LISTALL(sendData, function (respData) {
    //       res.status(respData.status).send(respData);
    //     });
    //   } catch (err) {
    //     res.status(404).send(err);
    //   }
    // });
  },
};
