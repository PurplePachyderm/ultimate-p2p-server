
    //Function to create events listeners
function listen(socket, database, peers){

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

                    let userData = {
                        faName: user.faName,
                        fiName: user.fiName,
                        pseudo: user.pseudo,
                        email: user.email
                    }

                    socket.emit('signUpSuccess', userData);
                });
            }
            else {
                socket.emit('signUpFailure');
            }
        });

    });



    socket.on('signIn', (user) => {
        console.log('signIn request !');

        let query = 'SELECT fiName, faName, pseudo, email \
        FROM users WHERE email = ? AND password = ?;';
        database.query(query, [user.email, user.password])
        .then(rows => {

            if(rows.length == 1){
                console.log("Success!");
                socket.emit('signInSuccess', rows[0]);
            }
            else {
                console.log("Failure =/");
                socket.emit('signInFailure');
            }

        });
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
