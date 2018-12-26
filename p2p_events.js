//Function to create events listeners
function listen(socket, database, peers){
    socket.on("newPeerId", (data) => {
        console.log("Receive new ID:" + data.peerId + " From:"+data.socketId);
        socket.broadcast.emit("newPeerId", data);

    });
}

module.exports = {listen};
