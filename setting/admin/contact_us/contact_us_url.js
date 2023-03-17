module.exports = {
    BindUrl: function () {
      app.get("/admin/contact_us", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.redirect("/admin");
            } else {
              var respData = {
                title: "Contact Us history",
                config: config,
                script: {
                  available: 1,
                  js: "contact_us",
                },
                css: {
                  available: 0,
                  css: "question",
                },
                menu: "contact_us",
                id:req.params.id

              };
              res.render("contact_us/contact_us.html", respData);
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });


      app.post("/admin/contact_us/list/:start/:limit", function (req, res) {
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
              admincontactusController.LIST(digitData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });


      app.post("/admin/contact_us/view", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              // console.log('a', search);
            
              // console.log(sendData);
              admincontactusController.VIEW(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/contact_us/send_mail", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const email = req.body.email;
              const reply= req.body.reply
              console.log('reply', reply);
              let html = `<b>Doggers Admin</b> sent you an email from <b>dhruvik.codezee@gmail.com</b>`
              let subject = "Contact Us Email"
              // console.log(sendData);
              commonController.__sendEmail2(email,reply,html,function (respData){
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