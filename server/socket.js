module.exports = (io) => {
    let generateBoard = () => {
        let b = randomSequence(1, 15, 5);
        let i = randomSequence(16, 30, 5);
        let n = randomSequence(31, 45, 4);
        // Element 0 represents the free space
        n.splice(2, 0, 0);
        let g = randomSequence(46, 60, 5);
        let o = randomSequence(61, 75, 5);
        return [b, i, n, g, o];
    };

    let randomSequence = (min, max, n) => {
        let nums = new Set();
        while (nums.size < n) {
            // Generates a random integer from min to max (inclusive)
            let rand = Math.floor(Math.random() * (max+1 - min) + min);
            nums.add(rand);
        }
        return Array.from(nums);
    }

    // 2 maps to allow finding a username or socket with the other key
    let users = new Map();
    let sockets = new Map();
    let boards = new Map();

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
                let board = generateBoard();
                boards.set(username, board);
                socket.emit('new_board', board);
                io.emit('user_update', Array.from(users.keys()));
            }
        });
    });
};