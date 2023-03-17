module.exports = {
    BindUrl: function () {
        var selfInst = this;

        //admin inform me
        app.get("/admin/packages", function (req, res) {
            try {
                validationController.CHECK_SESSION(req.session, function (respData) {
                    if (respData.err !== 0) {
                        res.redirect("/admin");
                    } else {
                        var respData = {
                            title: "Packages",
                            config: config,
                            script: {
                                available: 1,
                                js: "packages",
                            },
                            css: {
                                available: 0,
                                css: "question",
                            },
                            menu: "packages",
                        };
                        res.render("packages/packages.html", respData);
                    }
                });
            } catch (err) {
                res.status(404).send(err);
            }
        });

        app.post("/admin/packages/list/:start/:limit", function (req, res) {
            try {
                validationController.CHECK_SESSION(req.session, function (respData) {
                    if (respData.err !== 0) {
                        res.status(respData.status).send(respData);
                    } else {
                        const { start, limit } = req.params;
                        const search = req.body.search
                        const digitData = {
                            start: start,
                            limit: limit,
                            search : search
                        };
                        packagesAdminController.LIST(digitData, function (respData) {
                            res.status(respData.status).send(respData);
                        });
                    }
                });
            } catch (err) {
                res.status(404).send(err);
            }
        });

        app.post("/admin/packages/view", function (req, res) {
            try {
              validationController.CHECK_SESSION(req.session, function (respData) {
                if (respData.err !== 0) {
                  res.status(respData.status).send(respData);
                } else {
                  const sendData = req.body;
                  packagesAdminController.VIEW(sendData, function (respData) {
                    res.status(respData.status).send(respData);
                  });
                }
              });
            } catch (err) {
              res.status(404).send(err);
            }
          });
      
          app.post("/admin/packages/save", function (req, res) {
            try {
              validationController.CHECK_SESSION(req.session, function (respData) {
                if (respData.err !== 0) {
                  res.status(respData.status).send(respData);
                } else {
                  const sendData = req.body;
                  packagesAdminController.SAVE(sendData, function (respData) {
                    res.status(respData.status).send(respData);
                  });
                }
              });
            } catch (err) {
              res.status(404).send(err);
            }
          });

          app.post("/admin/packages/delete", function (req, res) {
            try {
              validationController.CHECK_SESSION(req.session, function (respData) {
                if (respData.err !== 0) {
                  res.status(respData.status).send(respData);
                } else {
                  var sendData = req.body;
                  sendData["userData"] = respData.data;
                  packagesAdminController.DELETE(sendData, function (respData) {
                    res.status(respData.status).send(respData);
                  });
                }
              });
            } catch (err) {
              res.status(404).send(err);
            }
          });


          app.get("/admin/packages/category", function (req, res) {
            try {
              const sendData  = {}
              // sendData.id=req.params.id
                packagesAdminController.PACKAGE_CATEGORY(sendData, function (respData) {
                  res.status(respData.status).send(respData);
                });
              } catch (err) {
              res.status(404).send(err);
            }
          });

          app.get("/admin/packages/subcategory/:_id", function (req, res) {
            try {
              const sendData  = {}
              sendData._id=req.params._id
                packagesAdminController.PACKAGE_SUBCATEGORY(sendData, function (respData) {
                  res.status(respData.status).send(respData);
                });
              } catch (err) {
              res.status(404).send(err);
            }
          });

    }
}