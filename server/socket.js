module.exports = (io) => {
    let sockets = new Map(); // Maps socket to username
    let users = new Set(); // Keeps track of usernames
    const targetUsers = 3;

    // Map to store user boards
    let boards = new Map();

    let balls = new Set();
    // Adds Free space to balls
    balls.add(0);
    // Declare interval for use later
    let ballInterval;

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
    };

    let checkBoard = (board) => {
        let rlDiag = true;
        let lrDiag = true;
        for (let i = 0; i < 5; i++) {
            let rlDiagCell = board[i][i];
            let lrDiagCell = board[i][4-i];
            if (!balls.has(rlDiagCell)) {
                rlDiag = false;
            }
            if (!balls.has(lrDiagCell)) {
                lrDiag = false;
            }

            let row = true;
            let col = true;

            for (let j = 0; j < 5; j++) {
                let rowCell = board[i][j];
                let colCell = board[j][i];
                if (!balls.has(rowCell)) {
                    row = false;
                }
                if (!balls.has(colCell)) {
                    col = false;
                }
                if (!row && !col) {
                    break;
                }
            }
            if (row || col) {
                return true;
            }
        }

        return rlDiag || lrDiag;

    };

    let pullBall = () => {
        // Generate random ball between 1 and 75 (inclusive)
        let rand = Math.floor(Math.random() * (76 - 1) + 1);
        while (balls.has(rand)) {
            rand = Math.floor(Math.random() * (76 - 1) + 1);
        }
        balls.add(rand);
        let ball;
        if (rand < 16) {
            ball = 'B' + rand;
        }
        else if (rand < 31) {
            ball = 'I' + rand;
        }
        else if (rand < 46) {
            ball = 'N' + rand;
        }
        else if (rand < 61) {
            ball = 'G' + rand;
        }
        else {
            ball = 'O' + rand;
        }
        io.emit('new_ball', ball)
    };

    io.on('connection', (socket) => {
        io.emit('user_update', Array.from(users));

        socket.on('disconnect', () => {
            // Remove users from the player list on disconnect
            username = sockets.get(socket.id);
            sockets.delete(socket.id);
            users.delete(username);
            io.emit('user_update', Array.from(users));
        });

        socket.on('new_user', (username) => {
            // Ensure that username are unique
            if (users.has(username)) {
                socket.emit('user_rejected', 'Username already taken!');
            }
            else if (users.size >= targetUsers) {
                socket.emit('user_rejected', 'Room already full!');
            }
            else {
                // Add new users and generate a board for them
                users.add(username);
                sockets.set(socket.id, username);
                socket.emit('user_accepted');
                let board = generateBoard();
                boards.set(socket.id, board);
                socket.emit('new_board', board);
                io.emit('user_update', Array.from(users));

                // Start the game once the target number of users is met
                if (users.size === targetUsers) {
                    ballInterval = setInterval(pullBall, 4000);
                }
            }
        });

        socket.on('bingo', () => {
            let board = boards.get(socket.id);
            let result = checkBoard(board);
            if (result) {
                // Stop pulling balls and alert the winner
                clearInterval(ballInterval);
                let username = sockets.get(socket.id);
                io.emit('winner', { 'id': socket.id, 'username': username });
            }
            else {
                socket.emit('no_bingo');
            }
        });
    });
};
