//Function to create events listeners
function listen(socket, database, peers){
    socket.on("newPeerId", (data) => {
        console.log("Receive new Peer ID: " + data.peerId + "  from socket: "+data.socketId);
        socket.broadcast.emit("newPeerId", data);

    });
}

module.exports = {listen};
