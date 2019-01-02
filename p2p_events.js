//Function to create events listeners
function listen(socket, database, users){

    //Update local data on user's shared file at his connection
    socket.on('clientListUpdate', (data) => {

        let eventSent;

        //Get user DB Id
        let id;
        let i=0;
        while(i<users.length){
            if(users[i].socketId == data.socketId){
                id = users[i].id;
                break;
            }
        }

        //Add new files
        if(data.unmatchedFiles.length > 0){
            eventSent = true;

                //Build the query dynamically to add all the files at once
            let query = 'INSERT INTO files (name, owners) VALUES (?, ?);'
            let newFilesData = {list: []};

            for(let i=0; i<data.unmatchedFiles.length; i++){

                database.query(query, [data.unmatchedFiles[i], id.toString()])
                .then(rows => {

                    newFilesData.list.push({id: rows.insertId, name: data.unmatchedFiles[i]});

                    if(i == data.unmatchedFiles.length - 1){
                        socket.emit('rebuildData', newFilesData);
                    }
                });
            }
        }


        //Remove owner in old files
        if(data.deletedFiles.length > 0){
            if(!eventSent){
                socket.emit('rebuildData', {list: []});
            }


            let query = 'SELECT owners, id FROM files WHERE id=?'
            let params = [data.deletedFiles[0]];

                //Build query && parameters array
            for(let i=1; i<data.deletedFiles.length; i++){
                query += ' OR id=?'
                params.push(data.deletedFiles[i].id);
            }
            query += ';';


            //Query
            database.query(query, params)
            .then(rows => {

                query = 'UPDATE files SET owners = ? WHERE ID = ?;';
                params = [];

                //Remove user ID to deleted files' "owners" field
                let newData = [];
                for(let i=0; i<rows.length; i++){

                    rows[i].owners = rows[i].owners.split(',');

                    for(let j=0; j<rows[i].owners.length; j++){

                        if(id == parseInt(rows[i].owners[j])){
                            rows[i].owners.splice(j, 1);

                            database.query(query, [rows[i].owners.toString(), rows[i].id])
                            .then(rows => {

                            });
                            break;
                        }
                    }
                }
            });
        }
    });
}







module.exports = {listen};
