module.exports = {
  BindUrl: function () {
    var selfInst = this;

    //addon inform
    app.get("/admin/groomer_products", function (req, res) {
      try {
        validationController.CHECK_SESSION(req.session, function (respData) {
          if (respData.err !== 0) {
            res.redirect("/admin");
          } else {
            var respData = {
              title: "Groomer Products",
              config: config,
              script: {
                available: 1,
                js: "groomer_products",
              },
              css: {
                available: 0,
                css: "question",
              },
              menu: "groomer_products",
            };
            res.render("groomer_products/groomer_products.html", respData);
          }
        });
      } catch (err) {
        res.status(404).send(err);
      }
    });

      app.post("/admin/groomer_products/save", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              // console.log(sendData);
              groomer_productsAdminController.SAVE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_products/list/:start/:limit", function (req, res) {
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
              groomer_productsAdminController.LIST(digitData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_products/view", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              const sendData = req.body;
              groomer_productsAdminController.VIEW(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });

      app.post("/admin/groomer_products/delete", function (req, res) {
        try {
          validationController.CHECK_SESSION(req.session, function (respData) {
            if (respData.err !== 0) {
              res.status(respData.status).send(respData);
            } else {
              var sendData = req.body;
              sendData["userData"] = respData.data;
              groomer_productsAdminController.DELETE(sendData, function (respData) {
                res.status(respData.status).send(respData);
              });
            }
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });
      app.get("/admin/listall/groomerproducts", function (req, res) {
        try {
          const sendData = {};
         groomer_productsAdminController.LISTALL(sendData, function (respData) {
            res.status(respData.status).send(respData);
          });
        } catch (err) {
          res.status(404).send(err);
        }
      });
  },
};
