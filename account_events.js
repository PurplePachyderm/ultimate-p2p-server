
    //Function to create events listeners
function listen(socket, database, users){

        //*** Sign up/in ***

    socket.on('signUp', (user) => {
        console.log('signUp request !');

        let query;

            //First, check that email is not already used
        let mailAvalaible;
        query = 'SELECT id FROM users WHERE email = ?;';
        database.query(query, [user.email])
        .then(rows => {

            mailAvalaible = !rows.length;

                //Add user to DB
            if(mailAvalaible){
                query = 'INSERT INTO users (faName, fiName, pseudo, email, password) VALUES(?, ?, ?, ?, ?);';
                database.query(query, [user.faName, user.fiName, user.pseudo, user.email, user.password])
                .then(rows => {
                    console.log("User added!");

                    users.push({id : rows[0].id, socketId: user.socketId, peerId: user.peerId});

                    let userData = {
                        faName: user.faName,
                        fiName: user.fiName,
                        pseudo: user.pseudo,
                        email: user.email
                    };
                    socket.emit('signInSuccess', userData);
                });
            }
            else {
                socket.emit('signUpFailure');
            }
        });

    });



    socket.on('signIn', (user) => {
        console.log('signIn request !');

        let query = 'SELECT id, fiName, faName, pseudo, email \
        FROM users WHERE email = ? AND password = ?;';
        database.query(query, [user.email, user.password])
        .then(rows => {

            if(rows.length == 1){
                console.log("Success!");

                users.push({id : rows[0].id, socketId: user.socketId, peerId: user.peerId});
                console.log(users);
                socket.emit('signInSuccess', rows[0]);
            }
            else {
                console.log("Failure =/");
                socket.emit('signInFailure');
            }

        });
    });



    socket.on('signOut', (user) => {
        console.log(user.socketId+' signing out');

        let i = 0;
        while(i < users.length){
            //Iterate the array backwards to match IDs faster
            if(users[i].socketId == user.socketId){
                users.splice(i, 1);
                break;
            }
            i++;
        }
    });


        //*** Account edits ***

    socket.on('faNameEdit', (user) => {
        console.log('faNameEdit request !');

        let query = 'UPDATE users SET faName = ? WHERE email = ?;'
        database.query(query, [user.faName, user.email])
        .then(rows => {
            socket.emit('faNameEditSuccess', {faName: user.faName});
            console.log("Emitted");
        });
    });


    socket.on('fiNameEdit', (user) => {
        console.log('fiNameEdit request !');

        let query = 'UPDATE users SET fiName = ? WHERE email = ?;'
        database.query(query, [user.fiName, user.email])
        .then(rows => {
            socket.emit('fiNameEditSuccess', {fiName: user.fiName});
            console.log("Emitted");
        });
    });


    socket.on('pseudoEdit', (user) => {
        console.log('pseudoEdit request !');

        let query = 'UPDATE users SET pseudo = ? WHERE email = ?;'
        database.query(query, [user.pseudo, user.email])
        .then(rows => {
            socket.emit('pseudoEditSuccess', {pseudo: user.pseudo});
            console.log("Emitted");
        });
    });


    socket.on('emailEdit', (user) => {
        console.log('emailEdit request !');

        let query;

            //First, check that email is not already used
        let mailAvalaible;
        query = 'SELECT id FROM users WHERE email = ?;';
        database.query(query, [user.newEmail])
        .then(rows => {

            if(rows.length == 0){
                let query = 'UPDATE users SET email = ? WHERE email = ?;'
                database.query(query, [user.newEmail, user.email])
                .then(rows => {
                    socket.emit('emailEditSuccess', {email: newEmail});
                    console.log("Emitted");
                });
            }

        });

    });


    socket.on('passwordEdit', (user) => {
        console.log('passwordEdit request !');

        let query = 'UPDATE users SET password = ? WHERE email = ?;'
        database.query(query, [user.password, user.email])
        .then(rows => {
            socket.emit('passwordEditSuccess');
        });
    });
}


    //Export func
module.exports = {listen};
