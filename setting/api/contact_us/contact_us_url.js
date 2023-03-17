

module.exports ={
    BindUrl: function (){

        app.post("/api/contact_us", function (req, res) {
            try {
              const sendData = req.body;
              // sendData.id=req.params.id
              contactusController.SAVE(
                sendData,
                function (respData) {
                   
                  res.status(respData.ReturnCode).send(respData);
                }
              );
            } catch (err) {
              res.status(404).send(err);
            }
          });
    }
}