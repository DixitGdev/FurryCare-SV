module.exports = {
    BindUrl: function () {
      app.get("/admin/groomer_attendance", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.redirect("/admin");
            } else {
              var respData = {
                title: "Groomer Attendance",
                config: config,
                script: {
                  available: 1,
                  js: "groomer_attendance",
                },
                css: {
                  available: 0,
                  css: "question",
                },
                menu: "groomer_attendance",
              };
              res.render("groomer_attendance/groomer_attendance.html", respData);
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_attendance/save", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              // console.log(sendData);
              groomerattendancecontroller.SAVE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });
      
      app.post("/admin/groomer_attendance/list/:start/:limit", function (req, res) {
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
              groomerattendancecontroller.LIST(digitData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_attendance/view", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session , function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              groomerattendancecontroller.VIEW(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_attendance/delete", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              // console.log(sendData);
              groomerattendancecontroller.DELETE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });



    }
}