//Function to create events listeners
function listen(socket, database, users){

    //Update local data on user's shared file at his connection
    socket.on('clientListUpdate', (data) => {
        console.log(data);

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
                //Build the query dynamically to add all the files at once
            let query = 'INSERT INTO files (name, owners) VALUES (?, ?);'

            for(let i=1; i<data.unmatchedFiles.length; i++){
                query += ', (?, ?)'
            }
            query += ';';

                //Build parameters array
            let params = [];
            for(let i=0; i<data.unmatchedFiles.length; i++){
                params.push(data.unmatchedFiles[i]);
                params.push(id.toString());
            }

            //Query
            database.query(query, params)
            .then(rows => {
                let newData = [];
                for(let i=0; i<rows.length; i++){
                    newData.push({id: rows[i].id});
                }

                socket.emit('newFiles', {list: newData});
            });
        }


        //Remove owner in old files
        if(data.deletedFiles.length > 0){
            //Build query
            let query = 'SELECT owners, id FROM files WHERE id=?;'
            for(let i=1; i<data.unmatchedFiles.length; i++){
                query += ' OR id=?'
            }
            query += ';';

                //Build parameters array
            let params = [];
            for(let i=0; i<data.deletedFiles.length; i++){
                params.push(data.deletedFiles[i].id);
            }


            //Query
            query = '';
            params = [];
            database.query(query, params)
            .then(rows => {

                //Remove user ID to deleted files' "owners" field
                let newData = [];
                for(let i=0; i<rows.length; i++){

                    rows[i].owners = rows[i].owners.split(',');
                    for(let j=0; j<rows[i].owners.length; j++){

                        if(id == parseInt(rows[i].owners[j])){
                            rows[i].owners.splice(j, 1);
                            query += 'UPDATE files SET owners = ? WHERE ID = ?; '
                            params.push(rows[i].owners.toString());
                            params.push(rows[i].id);
                            break;
                        }
                    }
                }

                return database.query(query, params);
            })
            .then(rows => {
                console.log('SUCCESSS');
            });


        }
    });
}







module.exports = {listen};
