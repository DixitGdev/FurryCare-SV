io.sockets.on('connection', function(socket) {
    if(typeof clients[socket.id] == 'undefined')
        clients[socket.id] = socket;
    socket.join('digits');
    console.log("Socket Connect >> ", socket.id);
    socket.on('req', function (data) {
        var en = data.en;
        console.log('Event Received <<---' + en + '--->>  ', JSON.stringify(data)); 
        console.log('socket.id >> ' + socket.id);

        switch(en) {
            
        }
    });
    socket.on('disconnect', function(reason) {
        console.log(socket.user_id);
        if(typeof socket.user_id != "undefined" && typeof clients[socket.user_id.toString()] != "undefined") {
            var sendData = {
                online: false,
                user_id: socket.user_id
            };
            console.log(sendData);
            commonController.sendDatatoTable('ONLINE', sendData, 1, socket.user_id);

            delete clients[socket.user_id.toString()];
        }
        console.log(socket.id +' disconnected because '+reason)
    });
});