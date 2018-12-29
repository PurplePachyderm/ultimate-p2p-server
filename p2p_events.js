//Function to create events listeners
function listen(socket, database, users){
    socket.on("newPeerId", (data) => {
        console.log("Receive new Peer ID: " + data.peerId + "  from socket: "+data.socketId);

        let i = users.length-1;
        while(i >= 0){
            //Iterate the array backwards to match IDs faster
            if(users[i].socketId == data.socketId){
                users[i].peerId = data.peerId;
                break;
            }
            i--;
        }
        console.log(users);

    });
}

module.exports = {listen};
