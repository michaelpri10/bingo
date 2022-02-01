module.exports = (io) => {


    // 2 maps to allow finding a username or socket with the other key
    let users = new Map();
    let sockets = new Map();

    io.on('connection', (socket) => {
        console.log('User connected');
        io.emit('user_update', Array.from(users.keys()));

        socket.on('disconnect', () => {
            // Remove users from the player list on disconnect
            username = sockets.get(socket.id);
            sockets.delete(socket.id);
            users.delete(username);
            io.emit('user_update', Array.from(users.keys()));
        });

        socket.on('new_user', (username) => {
            // Ensure that username are unique
            if (users.has(username)) {
                socket.emit('user_rejected', 'Username already taken!');
            }
            else {
                users.set(username, socket.id);
                sockets.set(socket.id, username);
                socket.emit('user_accepted');
                io.emit('user_update', Array.from(users.keys()));
            }
        });
    });
};