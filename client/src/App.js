import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
const ENDPOINT = 'http://127.0.0.1:4001';

function App() {
    const [users, setUsers] = useState([]);
    

    useEffect(() => {
        // Set up WebSocket connection and event-based calls
        const socket = socketIOClient(ENDPOINT);
        socket.on('user_update', list => {
            setUsers(list);
        });
        socket.on('user_accepted', () => {
            document.getElementById('name-input').remove();
        });
        socket.on('user_rejected', (msg) => {
            let error = document.getElementById('error');
            error.innerText = msg;
        });
        socket.on('new_board', (board) => {
            let letters = ['B', 'I', 'N', 'G', 'O'];
            let boardTable = document.getElementById('board');

            // Create individual cells on the board
            for (let i = 0; i < 5; i++) {
                let row  = document.createElement('tr');
                row.classList.add('board-row')
                for (let j = 0; j < 5; j++) {
                    let cell = document.createElement('td');
                    cell.classList.add('board-cell')
                    let text = letters[i] + board[i][j];
                    if (text === 'N0') {
                        text = 'Free';
                        cell.style.backgroundColor = 'red';

                    }
                    else {
                        cell.style.backgroundColor = 'white';
                    }
                    cell.innerText = text;
                    cell.addEventListener('click', (e) => {
                        let target = e.target;
                        if (target.style.backgroundColor === 'white') {
                            target.style.backgroundColor = 'red';
                        }
                        else {
                            target.style.backgroundColor = 'white';
                        }
                    });
                    row.appendChild(cell);
                }
                boardTable.appendChild(row);
                boardTable.style.display = 'table';
                let bingoButton = document.getElementById('bingo-button');
                bingoButton.style.display = 'block';
                let ballList = document.getElementById('ball-list');
                ballList.style.display = 'flex';
            }
        });
        socket.on('new_ball', (number) => {
            let ballList = document.getElementById('ball-list');
            let ball = document.createElement('div');
            ball.classList.add('ball');
            ball.innerText = number;
            ballList.appendChild(ball);
        });
        socket.on('winner', (data) => {
            // Check if the ID of the winner matches the ID of the current user
            let winner_id = data['id'];
            let winner_name = data['username'];
            if (winner_id === socket.id) {
                alert(`Congratulations ${winner_name}, you won!`);
            }
            else {
                alert(`Sorry, ${winner_name} won this bingo game!`);
            }
        });
        socket.on('no_bingo', () => {
            alert('Sorry, you do not have bingo yet!');
        });


        // Bingo handling
        const bingoButton = document.getElementById('bingo-button');
        bingoButton.addEventListener('click', () => {
            socket.emit('bingo')
        });

        // Name input handling
        const startButton = document.getElementById('join-button');
        startButton.addEventListener('click', () => {
            let username = document.getElementById('username').value;
            socket.emit('new_user', username);
        });

    }, []);

    return (
        <div className='App'>
            <h1>Bingo</h1>
            <div id='name-input'>
                <label>Enter Username: </label>
                <input id='username'/>
                <button id='join-button'>Join</button>
                <p id='error'></p>
            </div>
            <div className='container'>
                <div className='users'>
                    <h2>Users {users.length}/3</h2>
                    <ul id='users-list'>
                    {users.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                    </ul>
                </div>
                <div className='board-container'>
                    <table id='board'>
                    </table>
                    <button id='bingo-button'>BINGO</button>
                </div>
                <div id='ball-list'>
                </div>
            </div>
        </div>
    );
}

export default App;
