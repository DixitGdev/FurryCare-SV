module.exports = {
  BindUrl: function () {
    app.get("/admin/groomer_leave", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "Groomer Leave",
              config: config,
              script: {
                available: 1,
                js: "groomer_leave",
              },
              css: {
                available: 0,
                css: "question",
              },
              menu: "groomer_leave",
            };
            res.render("groomer_leave/groomer_leave.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_leave/save", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            // console.log(sendData);
            groomerleaveadmincontroller.SAVE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_leave/list/:start/:limit", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const { start, limit } = req.params;
            const search = req.body.search;
            // console.log('a', search);
            const digitData = {
              start: start,
              limit: limit,
              search: search,
            };
            // console.log(sendData);
            groomerleaveadmincontroller.LIST(digitData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_leave/view", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            groomerleaveadmincontroller.VIEW(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_leave/delete", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.status(respData.status).send(respData);
          } else {
            const sendData = req.body;
            // console.log(sendData);
            groomerleaveadmincontroller.DELETE(sendData, function (respData) {
              res.status(respData.status).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

    app.post("/admin/groomer_leave/list_groomer", function (req, res) {
      try {
        // validationController.CHECK_SESSION(req.session, function (respData) {
        // if (respData.err !== 0) {
        //     res.status(respData.status).send(respData);
        //   } else {
        const sendData = req.body;
      
        console.log("for listss", sendData);
        groomerleaveadmincontroller.LIST_GROOMERS(
          sendData,
          function (respData) {
            res.status(respData.status).send(respData);
          }
        );
        // }
        // });
      } catch (err) {
        res.status(404).send(err);
      }
    });
  },
};
