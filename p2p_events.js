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
            let query = 'INSERT INTO files (name, owners) VALUES (?, ?);';
            let newFilesData = {list: []};

            for(let i=0; i<data.unmatchedFiles.length; i++){

                database.query(query, [data.unmatchedFiles[i], id.toString()])
                .then(rows => {

                    newFilesData.list.push({id: rows.insertId, name: data.unmatchedFiles[i]});

                    if(i == data.unmatchedFiles.length - 1){
                        socket.emit('rebuildData', newFilesData);
                    };
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

        console.log("Exiting callback");

    });

    //TODO Optimize this shit

    socket.on('search', (data) => {

        let query = "SELECT id, name, owners FROM files WHERE files.name LIKE ? AND owners != '';";

        data.research = '%' + data.research + '%';

        database.query(query, [data.research])
        .then(rows => {
            console.log("Search result:");
            console.log(rows);

            socket.emit('searchResult', {results: rows});
        })
    });



    socket.on('download', data => {
        console.log('Downloading:'+data.id);

        let query = "SELECT owners FROM files WHERE id = ?;";

        database.query(query, [data.id])
        .then(rows => {
            let owners = rows[0].owners.split(',');
            for(let i=0; i<owners.length; i++){
                owners[i] = parseInt(owners[i]);
            }

            let i=0;
            let j;
            while(i<users.length){
                j=0;
                while(j<owners.length){
                    if(users[i].id == owners[j]){
                        console.log("Matched " + users[i]);
                        socket.emit('peerFound', {peerId: users[i].peerId, fileId: data.id});
                        i = users.length;
                        j = owners.length;
                    }
                    j++;
                }
                i++;
            }
        });
    });
}


module.exports = {listen};
