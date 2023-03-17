module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //admin inform me
    app.get("/admin/service_category", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "service category",
              config: config,
              script: {
                available: 1,
                js: "service_category",
              },
              css: {
                available: 0,
                css: "question",
              },
              menu: "service category",
            };
            res.render("service_category/service_category.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });
  
    app.post("/admin/service_category/list/:start/:limit", function (req, res) {
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
            servicecategoryAdmincontroller.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/service_category/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            console.log("x>>", sendData);
            servicecategoryAdmincontroller.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/service_category/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            servicecategoryAdmincontroller.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/service_category/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            var sendData = req.body;
            sendData["userData"] = respData.data;
            servicecategoryAdmincontroller.DELETE(
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

    //get_subcategory
    app.get("/admin/service_category/category", function (req, res) {
      try {
        const sendData = {};
        // sendData.id=req.params.id
        servicecategoryAdmincontroller.LIST_CATEGORY(
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
